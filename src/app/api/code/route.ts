import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { signInAs } from "@/lib/auth/session";

// 6 цифр — мільйон комбінацій, тому ліміт спроб обов'язковий.
const MAX_ATTEMPTS = 8;

/**
 * Вхід за кодом доступу: пошта + код, який людина бачила після оплати.
 * Потрібен для «оплатив з телефона — дивлюсь з ноутбука», поки немає
 * домену під magic link.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").replace(/\D/g, "");

  if (!email || code.length !== 6) {
    return NextResponse.json({ error: "email and 6-digit code required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Беремо оплачений рахунок цієї пошти з виданим кодом.
  const { data: order } = await admin
    .from("orders")
    .select("id, email, access_code, code_attempts")
    .eq("email", email)
    .eq("status", "success")
    .not("access_code", "is", null)
    .order("created_at", { ascending: false })
    .maybeSingle();

  // Однакова відповідь для «немає рахунку» і «невірний код»,
  // щоб не можна було перебором дізнатись, хто купив курс.
  const deny = () =>
    NextResponse.json({ error: "invalid code" }, { status: 401 });

  if (!order) return deny();

  if (order.code_attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "too many attempts" },
      { status: 429 }
    );
  }

  if (order.access_code !== code) {
    await admin
      .from("orders")
      .update({ code_attempts: order.code_attempts + 1 })
      .eq("id", order.id);
    return deny();
  }

  // Код вірний — лічильник спроб обнуляємо.
  await admin.from("orders").update({ code_attempts: 0 }).eq("id", order.id);

  const ok = await signInAs(order.email);
  if (!ok) {
    return NextResponse.json({ error: "could not sign in" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
