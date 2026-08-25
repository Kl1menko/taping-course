import { NextResponse } from "next/server";

// Приймає кваліфіковану заявку з лендінгу.
// Зараз логує в консоль сервера; щоб підключити доставку —
// заповни TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID у .env.local.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const s = (v: unknown) => String(v ?? "").trim();

  const name = s(body.name);
  const phone = s(body.phone);
  const email = s(body.email);

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone required" }, { status: 400 });
  }

  // відповіді кваліфікації
  const role = s(body.role);
  const experience = s(body.experience);
  const goal = s(body.goal);
  const problem = s(body.problem);
  const utm = (body.utm ?? {}) as Record<string, string>;

  const lead = {
    name, phone, email,
    role, experience, goal, problem,
    utm,
    at: new Date().toISOString(),
  };
  console.log("[lead]", lead);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const utmLine = Object.entries(utm)
      .map(([k, v]) => `${k}=${v}`)
      .join(" · ");

    const text = [
      "🟢 Нова заявка — курс тейпування",
      "",
      `Імʼя: ${name}`,
      `Телефон: ${phone}`,
      `Email: ${email || "—"}`,
      "",
      `Напрям: ${role || "—"}`,
      `Досвід: ${experience || "—"}`,
      `Мета: ${goal || "—"}`,
      `Проблема: ${problem || "—"}`,
      utmLine ? `\nUTM: ${utmLine}` : "",
    ].join("\n");

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    } catch (e) {
      // заявку вже прийнято — доставка не має ламати відповідь
      console.error("[lead] telegram delivery failed", e);
    }
  }

  return NextResponse.json({ ok: true });
}
