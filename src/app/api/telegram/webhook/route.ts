import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendMessage,
  CONTACT_KEYBOARD,
  REMOVE_KEYBOARD,
  type TgUpdate,
} from "@/lib/telegram";
import { generateLinkToken } from "@/lib/auth/session";
import { brand } from "@/content";

/**
 * Вебхук Telegram-бота.
 *
 * Два сценарії:
 *   /start <token> — людина прийшла з /thanks: токен уже прив'язаний
 *                    до оплаченого рахунку, лишається запам'ятати chat_id;
 *   /start         — прийшла сама: питаємо номер через request_contact
 *                    і шукаємо оплату за ним. Номер від Telegram
 *                    верифікований — SMS і Twilio не потрібні.
 *
 * Захист: Telegram не підписує запити, тому в URL вебхука кладеться
 * секрет (secret_token), який Telegram віддає заголовком.
 */
export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (
    secret &&
    request.headers.get("x-telegram-bot-api-secret-token") !== secret
  ) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let update: TgUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = update.message;
  if (!msg) return NextResponse.json({ ok: true });

  const chatId = msg.chat.id;
  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  // ─── Людина поділилась номером ─────────────────────────────
  if (msg.contact) {
    // Чужий контакт із адресної книги не рахуємо за свій.
    if (msg.contact.user_id && msg.contact.user_id !== msg.from?.id) {
      await sendMessage(
        chatId,
        "Це чужий контакт. Натисни кнопку ще раз і поділись <b>своїм</b> номером.",
        { reply_markup: CONTACT_KEYBOARD }
      );
      return NextResponse.json({ ok: true });
    }

    const phone = normalizePhone(msg.contact.phone_number);
    const { data: order } = await admin
      .from("orders")
      .select("id, email, user_id")
      .eq("status", "success")
      .not("phone", "is", null)
      .filter("phone", "like", `%${phone.slice(-9)}`)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (!order) {
      await sendMessage(
        chatId,
        "За цим номером оплати не знайшлось.\n\n" +
          "Якщо оплачував із іншим номером — напиши нам, розберемось вручну: " +
          brand.telegramHandle,
        { reply_markup: REMOVE_KEYBOARD }
      );
      return NextResponse.json({ ok: true });
    }

    await bindTelegram(order, chatId, msg.from?.username, phone);
    await sendAccessLink(chatId, order, origin);
    return NextResponse.json({ ok: true });
  }

  // ─── /start ────────────────────────────────────────────────
  const text = (msg.text ?? "").trim();
  if (text.startsWith("/start")) {
    const token = text.slice("/start".length).trim();

    if (token) {
      const { data: link } = await admin
        .from("telegram_links")
        .select("token, order_id, email, used_at, expires_at")
        .eq("token", token)
        .maybeSingle();

      if (!link || link.used_at || new Date(link.expires_at) < new Date()) {
        await sendMessage(
          chatId,
          "Посилання застаріло. Поділись номером — знайду оплату за ним.",
          { reply_markup: CONTACT_KEYBOARD }
        );
        return NextResponse.json({ ok: true });
      }

      const { data: order } = await admin
        .from("orders")
        .select("id, email, user_id")
        .eq("id", link.order_id!)
        .maybeSingle();

      if (order) {
        await admin
          .from("telegram_links")
          .update({ used_at: new Date().toISOString() })
          .eq("token", token);
        await bindTelegram(order, chatId, msg.from?.username, null);
        await sendAccessLink(chatId, order, origin);
        return NextResponse.json({ ok: true });
      }
    }

    await sendMessage(
      chatId,
      `Вітаю! Це бот <b>${brand.name}</b>.\n\n` +
        "Щоб відкрити кабінет — поділись номером, на який оформлював оплату.",
      { reply_markup: CONTACT_KEYBOARD }
    );
    return NextResponse.json({ ok: true });
  }

  await sendMessage(
    chatId,
    "Щоб увійти в кабінет — надішли /start.",
  );
  return NextResponse.json({ ok: true });
}

/** Номер до цифр: у базі й у Telegram формати різні (+380 / 380 / 0…). */
function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

async function bindTelegram(
  order: { id: string; email: string; user_id: string | null },
  chatId: number,
  username: string | undefined,
  phone: string | null
) {
  const admin = createAdminClient();
  const { resolveUser } = await import("@/lib/auth/grant");
  const userId = order.user_id ?? (await resolveUser(order.email));
  if (!userId) return;

  await admin
    .from("profiles")
    .update({
      telegram_id: chatId,
      telegram_user: username ?? null,
      ...(phone ? { phone, phone_verified: true } : {}),
    })
    .eq("id", userId);
}

/**
 * Надсилає одноразове посилання входу.
 * Токен живе в telegram_links і гаситься при використанні —
 * переслане посилання нікому доступу не відкриє.
 */
async function sendAccessLink(
  chatId: number,
  order: { id: string; email: string; user_id: string | null },
  origin: string
) {
  const admin = createAdminClient();
  const token = generateLinkToken();

  await admin.from("telegram_links").insert({
    token,
    order_id: order.id,
    user_id: order.user_id,
    email: order.email,
    expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
  });

  await sendMessage(
    chatId,
    "Доступ відкрито ✅\n\nНатисни, щоб увійти в кабінет:",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Відкрити кабінет", url: `${origin}/tg/${token}` }],
        ],
      },
    }
  );
}
