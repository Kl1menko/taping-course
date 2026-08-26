import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateLinkToken } from "@/lib/auth/session";
import { botUsername } from "@/lib/telegram";

/**
 * Deep link на бота для кнопки «Отримати доступ у Telegram» на /thanks.
 * Токен прив'язаний до конкретного оплаченого рахунку — бот за ним
 * одразу знає, кому відкривати доступ, без питань про номер.
 */
export async function POST(request: Request) {
  const bot = botUsername();
  if (!bot) {
    return NextResponse.json({ error: "bot not configured" }, { status: 503 });
  }

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
    .select("id, email, user_id, status")
    .eq("reference", reference)
    .maybeSingle();

  // Deep link видаємо лише за оплаченим рахунком.
  if (!order || order.status !== "success") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const token = generateLinkToken();
  await admin.from("telegram_links").insert({
    token,
    order_id: order.id,
    user_id: order.user_id,
    email: order.email,
  });

  return NextResponse.json({ url: `https://t.me/${bot}?start=${token}` });
}
