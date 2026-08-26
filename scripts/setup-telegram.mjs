#!/usr/bin/env node
/**
 * Реєструє вебхук Telegram-бота.
 *
 *   node scripts/setup-telegram.mjs                 # показати поточний стан
 *   node scripts/setup-telegram.mjs --set           # зареєструвати вебхук
 *   node scripts/setup-telegram.mjs --delete        # зняти вебхук
 *
 * Змінні беруться з .env.local.
 */
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const site = process.env.NEXT_PUBLIC_SITE_URL;

if (!token) {
  console.error("TELEGRAM_BOT_TOKEN не заданий у .env.local");
  process.exit(1);
}

const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).then((r) => r.json());

const mode = process.argv[2];

if (mode === "--set") {
  if (!site?.startsWith("https://")) {
    console.error("NEXT_PUBLIC_SITE_URL має бути https-адресою:", site);
    process.exit(1);
  }
  const url = `${site}/api/telegram/webhook`;
  const res = await api("setWebhook", {
    url,
    secret_token: secret || undefined,
    allowed_updates: ["message"],
    drop_pending_updates: true,
  });
  console.log(res.ok ? `✅ вебхук зареєстровано: ${url}` : `❌ ${res.description}`);

  // Команди в синьому меню біля поля вводу — щоб бот не виглядав
  // порожнім для того, хто відкрив його вперше.
  const cmds = await api("setMyCommands", {
    commands: [
      { command: "start", description: "Відкрити кабінет" },
      { command: "progress", description: "Мій прогрес" },
      { command: "help", description: "Допомога" },
    ],
  });
  console.log(cmds.ok ? "✅ команди меню оновлено" : `❌ ${cmds.description}`);
  if (!secret) {
    console.log("⚠️  TELEGRAM_WEBHOOK_SECRET не заданий — вебхук відкритий для будь-кого.");
  }
} else if (mode === "--delete") {
  const res = await api("deleteWebhook", { drop_pending_updates: true });
  console.log(res.ok ? "✅ вебхук знято" : `❌ ${res.description}`);
} else {
  const me = await api("getMe");
  const info = await api("getWebhookInfo");
  console.log("Бот:    ", me.ok ? `@${me.result.username}` : `❌ ${me.description}`);
  console.log("Вебхук: ", info.result?.url || "(не зареєстрований)");
  if (info.result?.last_error_message) {
    console.log("Помилка:", info.result.last_error_message);
  }
  console.log("\nЩоб зареєструвати: node scripts/setup-telegram.mjs --set");
}
