import { NextResponse } from "next/server";

// Приймає заявку з форми. Зараз просто логує в консоль сервера.
// Щоб підключити реальну доставку — розкоментуй один із блоків нижче
// і додай відповідні змінні в .env.local
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const note = String(body.note ?? "").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone required" }, { status: 400 });
  }

  const lead = { name, phone, email, note, at: new Date().toISOString() };
  console.log("[lead]", lead);

  // ── Варіант 1: надіслати в Telegram ────────────────────────
  // const token = process.env.TELEGRAM_BOT_TOKEN;
  // const chatId = process.env.TELEGRAM_CHAT_ID;
  // if (token && chatId) {
  //   await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       chat_id: chatId,
  //       text: `Нова заявка\nІм'я: ${name}\nТел: ${phone}\nEmail: ${email || "—"}\nПитання: ${note || "—"}`,
  //     }),
  //   });
  // }

  // ── Варіант 2: надіслати на email через Resend ─────────────
  // await fetch("https://api.resend.com/emails", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     from: "Лендінг <noreply@your-domain.com>",
  //     to: process.env.LEAD_EMAIL,
  //     subject: `Нова заявка: ${name}`,
  //     text: JSON.stringify(lead, null, 2),
  //   }),
  // });

  return NextResponse.json({ ok: true });
}
