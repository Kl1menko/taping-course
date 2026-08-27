import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { brand } from "@/content";

type Body = {
  lessonId?: string;
  text?: string;
  photos?: unknown;
  /** true — надіслати на перевірку, false — зберегти чернетку. */
  submit?: boolean;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const lessonId = String(body.lessonId ?? "");
  const text = String(body.text ?? "").trim().slice(0, 4000);
  const submit = body.submit !== false;
  const photos = Array.isArray(body.photos)
    ? body.photos.map(String).filter((p) => p.startsWith(`${user.id}/`))
    : [];

  // Завдання читаємо під RLS: без доступу до курсу вибірка порожня,
  // тож окремої перевірки enrollment тут не треба.
  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, min_photos, max_photos")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (!assignment) {
    return NextResponse.json({ error: "assignment not found" }, { status: 404 });
  }

  if (photos.length > assignment.max_photos) {
    return NextResponse.json(
      { error: `максимум ${assignment.max_photos} фото` },
      { status: 400 }
    );
  }

  // Вимоги перевіряємо лише на здачі — чернетку можна зберігати будь-яку.
  if (submit) {
    if (!text) {
      return NextResponse.json({ error: "опиши, як виконувала завдання" }, { status: 400 });
    }
    if (photos.length < assignment.min_photos) {
      return NextResponse.json(
        { error: `додай щонайменше ${assignment.min_photos} фото` },
        { status: 400 }
      );
    }
  }

  const now = new Date().toISOString();
  const { data: saved, error } = await supabase
    .from("submissions")
    .upsert(
      {
        user_id: user.id,
        assignment_id: assignment.id,
        lesson_id: lessonId,
        text,
        photos,
        status: submit ? "submitted" : "draft",
        submitted_at: submit ? now : null,
        // Нова здача після доопрацювання — вердикт куратора скидаємо.
        feedback: null,
        reviewed_at: null,
        reviewed_by: null,
      },
      { onConflict: "user_id,assignment_id" }
    )
    .select("id, status")
    .single();

  if (error) {
    console.error("[homework] save failed", error);
    return NextResponse.json({ error: "не вдалося зберегти" }, { status: 500 });
  }

  // Прийняту роботу не переписуємо: RLS на update пропускає лише
  // draft/rework/submitted, тож сюди ми дійдемо тільки у дозволених станах.
  if (submit) notifyCurator(user.email, lessonId, text);

  return NextResponse.json({ ok: true, status: saved.status });
}

/** Сповіщення кураторові в Telegram. Помилка доставки не ламає здачу. */
function notifyCurator(email: string | undefined, lessonId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const message = [
    `📝 Нова домашня робота — ${brand.product}`,
    "",
    `Від: ${email ?? "—"}`,
    `Урок: ${lessonId}`,
    "",
    text.slice(0, 500),
  ].join("\n");

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  }).catch((e) => console.error("[homework] telegram delivery failed", e));
}
