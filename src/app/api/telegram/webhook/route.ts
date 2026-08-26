import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendMessage,
  CONTACT_KEYBOARD,
  REMOVE_KEYBOARD,
  type TgUpdate,
} from "@/lib/telegram";
import { generateLinkToken } from "@/lib/auth/session";
import { resolveUser } from "@/lib/auth/grant";
import { brand } from "@/content";

/**
 * Вебхук Telegram-бота — єдиний вхід у кабінет.
 *
 * Пошта як канал недоступна (немає домену під Resend), тому доступ
 * підтверджується номером телефону: Telegram віддає його
 * верифікованим через request_contact, тому SMS не потрібні.
 *
 *   /start <token> — прийшла з /thanks: токен уже прив'язаний до оплати;
 *   /start         — прийшла сама: питаємо номер і шукаємо оплату;
 *   /grant …       — адмін відкриває доступ вручну, якщо номер не збігся.
 *
 * Захист: Telegram не підписує запити, тому в URL вебхука кладеться
 * секрет, який Telegram віддає заголовком.
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
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const text = (msg.text ?? "").trim();

  // ─── Людина поділилась номером ─────────────────────────────
  if (msg.contact) {
    // Чужий контакт з адресної книги не рахуємо за свій.
    if (msg.contact.user_id && msg.contact.user_id !== msg.from?.id) {
      await sendMessage(
        chatId,
        "Це чужий контакт. Натисни кнопку ще раз і поділись <b>своїм</b> номером.",
        { reply_markup: CONTACT_KEYBOARD }
      );
      return NextResponse.json({ ok: true });
    }

    const order = await findOrderByPhone(msg.contact.phone_number);

    if (!order) {
      await sendMessage(
        chatId,
        "За цим номером оплати не знайшлось 🤔\n\n" +
          "Таке буває, якщо при оформленні був інший номер. " +
          `Напиши ${brand.telegramHandle} — відкриємо доступ вручну, це швидко.`,
        { reply_markup: REMOVE_KEYBOARD }
      );
      return NextResponse.json({ ok: true });
    }

    await bindTelegram(order, chatId, msg.from?.username, normalizePhone(msg.contact.phone_number));
    await sendAccessLink(chatId, order, origin);
    return NextResponse.json({ ok: true });
  }

  // ─── Адмінські команди ─────────────────────────────────────
  if (text.startsWith("/grant") || text.startsWith("/find")) {
    return handleAdmin(chatId, text, origin);
  }

  // ─── /start ────────────────────────────────────────────────
  if (text.startsWith("/start")) {
    const token = text.slice("/start".length).trim();

    if (token) {
      const order = await orderByLinkToken(token);
      if (order) {
        await bindTelegram(order, chatId, msg.from?.username, null);
        await sendAccessLink(chatId, order, origin);
        return NextResponse.json({ ok: true });
      }
      await sendMessage(
        chatId,
        "Посилання застаріло. Поділись номером — знайду оплату за ним.",
        { reply_markup: CONTACT_KEYBOARD }
      );
      return NextResponse.json({ ok: true });
    }

    // Уже приходив — не питаємо номер удруге.
    const known = await orderByTelegramId(chatId);
    if (known) {
      await sendAccessLink(chatId, known, origin);
      return NextResponse.json({ ok: true });
    }

    await sendMessage(
      chatId,
      `Вітаю! Це бот <b>${brand.name}</b>.\n\n` +
        "Щоб відкрити кабінет — поділись номером, на який оформлював оплату. " +
        "Кнопка внизу 👇",
      { reply_markup: CONTACT_KEYBOARD }
    );
    return NextResponse.json({ ok: true });
  }

  // Будь-яке інше повідомлення: у того, хто вже входив, — одразу
  // посилання; у решти — прохання поділитись номером.
  const known = await orderByTelegramId(chatId);
  if (known) {
    await sendAccessLink(chatId, known, origin);
  } else {
    await sendMessage(
      chatId,
      "Щоб увійти в кабінет — поділись номером, на який оформлював оплату.",
      { reply_markup: CONTACT_KEYBOARD }
    );
  }
  return NextResponse.json({ ok: true });
}

type Order = { id: string; email: string; user_id: string | null };

/** Номер до цифр: формати в базі й у Telegram різні (+380 / 380 / 0…). */
function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Шукає оплачене замовлення за номером.
 * Порівнюємо останні 9 цифр — це національний номер без коду країни
 * і без провідного нуля, тому +380671234567, 380671234567 і 0671234567
 * дають однаковий збіг.
 */
async function findOrderByPhone(raw: string): Promise<Order | null> {
  const tail = normalizePhone(raw).slice(-9);
  if (tail.length < 9) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("orders")
    .select("id, email, user_id")
    .eq("status", "success")
    .like("phone", `%${tail}`)
    .order("created_at", { ascending: false })
    .limit(1);

  return data?.[0] ?? null;
}

/** Замовлення за вже прив'язаним Telegram — щоб не питати номер щоразу. */
async function orderByTelegramId(chatId: number): Promise<Order | null> {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, email")
    .eq("telegram_id", chatId)
    .maybeSingle();
  if (!profile) return null;

  // Доступ міг бути виданий вручну — тоді замовлення немає,
  // але enrollment є. Перевіряємо саме доступ.
  const { data: enrollment } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", profile.id)
    .maybeSingle();
  if (!enrollment) return null;

  return { id: "", email: profile.email as string, user_id: profile.id };
}

/** Замовлення за одноразовим токеном із /thanks. */
async function orderByLinkToken(token: string): Promise<Order | null> {
  const admin = createAdminClient();
  const { data: link } = await admin
    .from("telegram_links")
    .select("token, order_id, used_at, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!link || link.used_at || new Date(link.expires_at) < new Date()) return null;

  const { data: order } = await admin
    .from("orders")
    .select("id, email, user_id")
    .eq("id", link.order_id!)
    .maybeSingle();
  if (!order) return null;

  await admin
    .from("telegram_links")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token);

  return order;
}

async function bindTelegram(
  order: Order,
  chatId: number,
  username: string | undefined,
  phone: string | null
) {
  const admin = createAdminClient();
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
 * Токен гаситься при використанні — переслане посилання марне.
 */
async function sendAccessLink(chatId: number, order: Order, origin: string) {
  const admin = createAdminClient();
  const token = generateLinkToken();

  await admin.from("telegram_links").insert({
    token,
    order_id: order.id || null,
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

/**
 * /find <пошта|номер>  — подивитись, що є по клієнту
 * /grant <пошта>       — відкрити доступ вручну
 *
 * Потрібні, коли номер у формі не збігся з номером у Telegram:
 * інакше єдиний вихід — лізти в SQL.
 */
async function handleAdmin(chatId: number, text: string, origin: string) {
  const admin = createAdminClient();

  const { data: me } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("telegram_id", chatId)
    .maybeSingle();

  // Мовчимо для чужих: команда не має видавати, що вона існує.
  if (!me?.is_admin) return NextResponse.json({ ok: true });

  const [cmd, ...rest] = text.split(/\s+/);
  const arg = rest.join(" ").trim().toLowerCase();

  if (!arg) {
    await sendMessage(chatId, `Формат: <code>${cmd} пошта або номер</code>`);
    return NextResponse.json({ ok: true });
  }

  const isEmail = arg.includes("@");
  const tail = normalizePhone(arg).slice(-9);

  const query = admin
    .from("orders")
    .select("id, email, full_name, phone, status, amount, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: orders } = isEmail
    ? await query.eq("email", arg)
    : await query.like("phone", `%${tail}`);

  if (!orders?.length) {
    await sendMessage(chatId, "Нічого не знайшов 🤷");
    return NextResponse.json({ ok: true });
  }

  if (cmd === "/find") {
    const lines = orders.map((o) => {
      const sum = (o.amount / 100).toFixed(2);
      const date = new Date(o.created_at).toLocaleDateString("uk-UA");
      return `<b>${o.email}</b>\n${o.full_name ?? "—"} · ${o.phone ?? "—"}\n${o.status} · ${sum} грн · ${date}`;
    });
    await sendMessage(chatId, lines.join("\n\n"));
    return NextResponse.json({ ok: true });
  }

  // /grant — відкриваємо доступ за першим (найсвіжішим) замовленням.
  const order = orders[0];
  const userId = order.user_id ?? (await resolveUser(order.email));
  if (!userId) {
    await sendMessage(chatId, "Не вдалося створити користувача 😕");
    return NextResponse.json({ ok: true });
  }

  await admin.from("enrollments").upsert(
    { user_id: userId, order_id: order.id, source: "manual" },
    { onConflict: "user_id" }
  );

  const token = generateLinkToken();
  await admin.from("telegram_links").insert({
    token,
    order_id: order.id,
    user_id: userId,
    email: order.email,
    expires_at: new Date(Date.now() + 24 * 3600_000).toISOString(),
  });

  await sendMessage(
    chatId,
    `Доступ відкрито для <b>${order.email}</b> ✅\n\n` +
      `Перешли це посилання клієнту (діє добу):\n${origin}/tg/${token}`
  );
  return NextResponse.json({ ok: true });
}
