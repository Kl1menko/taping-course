import { NextResponse } from "next/server";
import { getInvoiceStatus } from "@/lib/mono";
import { createAdminClient } from "@/lib/supabase/server";
import { grantAccess } from "@/lib/auth/grant";
import { signInAs } from "@/lib/auth/session";

/**
 * Вхід одразу після оплати.
 *
 * monobank повертає людину на /thanks?ref=…, звідти сюди. Довіряти
 * самому факту повернення не можна — redirectUrl лишається в історії
 * браузера і його можна переслати. Тому:
 *   1) статус рахунку питаємо в monobank напряму;
 *   2) сума має збігатися з тією, що зафіксована при створенні;
 *   3) авто-вхід спрацьовує рівно один раз (auto_login_used_at).
 * Далі — тільки код доступу або Telegram.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const reference = String(body.ref ?? "").trim();
  if (!reference) {
    return NextResponse.json({ error: "ref required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, email, user_id, amount, status, invoice_id, auto_login_used_at")
    .eq("reference", reference)
    .maybeSingle();

  if (!order || !order.invoice_id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Посилання вже спрацювало — далі лише через код чи Telegram.
  if (order.auto_login_used_at) {
    return NextResponse.json({ error: "already used" }, { status: 409 });
  }

  // Джерело правди — monobank, а не те, що прийшло в браузер.
  let paid = order.status === "success";
  if (!paid) {
    try {
      const invoice = await getInvoiceStatus(order.invoice_id);
      paid = invoice.status === "success" && invoice.amount === order.amount;
      if (paid) {
        await admin.from("orders").update({
          status: "success",
          raw: invoice,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("id", order.id);
      }
    } catch (e) {
      console.error("[claim] monobank недоступний", e);
      return NextResponse.json({ error: "provider unavailable" }, { status: 503 });
    }
  }

  if (!paid) {
    return NextResponse.json({ error: "not paid" }, { status: 402 });
  }

  const granted = await grantAccess(order);
  if (!granted) {
    return NextResponse.json({ error: "could not grant access" }, { status: 500 });
  }

  // Гасимо посилання ДО видачі сесії: якщо вхід не вдасться, людина
  // піде через код — це гірше, ніж лишити посилання багаторазовим.
  await admin
    .from("orders")
    .update({ auto_login_used_at: new Date().toISOString() })
    .eq("id", order.id);

  const ok = await signInAs(order.email);

  return NextResponse.json({ ok, email: order.email });
}
