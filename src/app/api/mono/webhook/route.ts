import { NextResponse } from "next/server";
import { verifyWebhook, type WebhookPayload } from "@/lib/mono";
import { createAdminClient } from "@/lib/supabase/server";

// Вебхук monobank: підтверджує оплату й відкриває доступ.
export async function POST(request: Request) {
  // Читаємо СИРЕ тіло — підпис рахується саме над ним.
  const raw = await request.text();
  const ok = await verifyWebhook(raw, request.headers.get("x-sign"));
  if (!ok) {
    console.warn("[mono webhook] invalid signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 403 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, user_id, email, status, amount")
    .eq("invoice_id", payload.invoiceId)
    .maybeSingle();

  if (!order) {
    // Рахунку немає — відповідаємо 200, щоб monobank не ретраїв вічно.
    console.warn("[mono webhook] unknown invoice", payload.invoiceId);
    return NextResponse.json({ ok: true });
  }

  // Ідемпотентність: успішний платіж обробляємо один раз.
  if (order.status === "success") return NextResponse.json({ ok: true });

  await admin
    .from("orders")
    .update({
      status: payload.status,
      raw: payload,
      paid_at: payload.status === "success" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (payload.status !== "success") return NextResponse.json({ ok: true });

  // Сума має збігатися — захист від оплати меншою сумою.
  if (payload.amount !== order.amount) {
    console.error("[mono webhook] amount mismatch", {
      expected: order.amount,
      got: payload.amount,
    });
    return NextResponse.json({ ok: true });
  }

  // Знаходимо або створюємо користувача за email і відкриваємо доступ.
  let userId = order.user_id;
  if (!userId) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: order.email,
      email_confirm: true,
    });
    if (created?.user) {
      userId = created.user.id;
    } else if (error) {
      // Уже існує — дістаємо наявного. listUsers() посторінковий
      // (50 за раз), тому шукаємо через profiles за email:
      // профіль створює тригер on_auth_user_created.
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("email", order.email)
        .maybeSingle();
      userId = profile?.id ?? null;
    }
    if (userId) {
      await admin.from("orders").update({ user_id: userId }).eq("id", order.id);
    }
  }

  if (!userId) {
    console.error("[mono webhook] could not resolve user for", order.email);
    return NextResponse.json({ ok: true });
  }

  await admin
    .from("enrollments")
    .upsert({ user_id: userId, order_id: order.id, source: "purchase" },
            { onConflict: "user_id" });

  // Лист із посиланням на вхід. Без нього людина, яка закрила вкладку
  // після оплати, не знає, як потрапити в кабінет.
  // Помилка тут не має ламати вебхук — доступ уже відкрито, і людина
  // завжди може увійти сама через /login.
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const { error: mailErr } = await admin.auth.signInWithOtp({
      email: order.email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/cabinet`,
      },
    });
    if (mailErr) throw mailErr;
  } catch (e) {
    console.error("[mono webhook] не вдалося надіслати лист доступу", e);
  }

  return NextResponse.json({ ok: true });
}
