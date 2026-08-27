import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { qualification, brand } from "@/content";

// Онбординг-квіз кабінету. Раніше жив на лендінгу як заявка —
// тепер його проходить уже оплачений користувач перед першим уроком.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Беремо лише відомі питання — довільні ключі в jsonb не пускаємо.
  const answers: Record<string, string> = {};
  for (const q of qualification.questions) {
    const value = String(body[q.id] ?? "").trim();
    if (value && q.options.includes(value)) answers[q.id] = value;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      quiz_answers: answers,
      quiz_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[quiz] save failed", error);
    return NextResponse.json({ error: "не вдалося зберегти" }, { status: 500 });
  }

  notifyCurator(user.email, answers);
  return NextResponse.json({ ok: true });
}

function notifyCurator(email: string | undefined, answers: Record<string, string>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = qualification.questions
    .map((q) => `${q.label}\n— ${answers[q.id] ?? "—"}`)
    .join("\n\n");

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `👤 Анкета студента — ${brand.product}\n\n${email ?? "—"}\n\n${lines}`,
    }),
  }).catch((e) => console.error("[quiz] telegram delivery failed", e));
}
