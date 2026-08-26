import "server-only";

const API = "https://api.telegram.org";

export function botToken(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return t;
}

export function botUsername(): string | null {
  return process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? null;
}

type TgResponse = { ok: boolean; description?: string; result?: unknown };

export async function callTelegram(
  method: string,
  payload: Record<string, unknown>
): Promise<TgResponse> {
  const res = await fetch(`${API}/bot${botToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const json = (await res.json()) as TgResponse;
  if (!json.ok) console.error(`[telegram] ${method}:`, json.description);
  return json;
}

export function sendMessage(
  chatId: number,
  text: string,
  extra: Record<string, unknown> = {}
) {
  return callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    ...extra,
  });
}

/** Клавіатура з однією кнопкою «поділитись контактом». */
export const CONTACT_KEYBOARD = {
  keyboard: [[{ text: "📱 Поділитись номером", request_contact: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

export const REMOVE_KEYBOARD = { remove_keyboard: true };

// ─── Типи апдейтів, які нас цікавлять ────────────────────────
export type TgUser = {
  id: number;
  username?: string;
  first_name?: string;
};

export type TgUpdate = {
  message?: {
    chat: { id: number };
    from?: TgUser;
    text?: string;
    contact?: {
      phone_number: string;
      user_id?: number;
    };
  };
};
