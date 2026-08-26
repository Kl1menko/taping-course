import { NextResponse } from "next/server";
import { verifyWebhook, type WebhookPayload } from "@/lib/mono";
import { createAdminClient } from "@/lib/supabase/server";
import { grantAccess } from "@/lib/auth/grant";

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
    .select("id, user_id, email, status, amount, access_code")
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

  // Створює юзера (якщо треба), відкриває доступ і видає код.
  const granted = await grantAccess(order);
  if (!granted) return NextResponse.json({ ok: true });

  // Лист із посиланням на вхід — приємний бонус, а не єдиний шлях:
  // доступ уже відкрито, код доступу показано на /thanks, і є Telegram.
  // Поки немає власного домену, Resend шле лише на пошту власника
  // акаунта, тому помилка тут очікувана і нічого не ламає.
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    await admin.auth.signInWithOtp({
      email: order.email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=/cabinet` },
    });
  } catch (e) {
    console.error("[mono webhook] лист доступу не пішов", e);
  }

  return NextResponse.json({ ok: true });
}
