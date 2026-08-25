#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Прив'язка відео з YouTube-плейлиста до уроків курсу.
//
//    node scripts/link-videos.mjs "<посилання на плейлист>"
//    node scripts/link-videos.mjs "<посилання>" --apply
//
//  Без --apply нічого не пише в базу, лише показує, що вийде.
//  Відео зіставляються з уроками ПО ПОРЯДКУ: перше відео плейлиста
//  → перший урок модуля 01 і так далі. Тому порядок у плейлисті
//  має збігатися з порядком уроків.
// ─────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";

// ─── env ─────────────────────────────────────────────────────
function loadEnv() {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {
    // змінні можуть бути вже в оточенні
  }
}
loadEnv();

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_BASE || !KEY) {
  console.error("✖ Немає NEXT_PUBLIC_SUPABASE_URL або SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const playlistUrl = process.argv[2];
const apply = process.argv.includes("--apply");

if (!playlistUrl) {
  console.error("Використання: node scripts/link-videos.mjs \"<посилання на плейлист>\" [--apply]");
  process.exit(1);
}

// ─── читання плейлиста ───────────────────────────────────────
/**
 * Дістає id та назви відео зі сторінки плейлиста.
 * YouTube віддає дані в JSON всередині HTML — окремий API-ключ не потрібен.
 */
async function fetchPlaylist(url) {
  const res = await fetch(url, {
    headers: {
      // Без цього YouTube може віддати спрощену сторінку без даних.
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/122.0 Safari/537.36",
      "Accept-Language": "uk,en;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`YouTube відповів ${res.status}`);
  const html = await res.text();

  const videos = [];
  const seen = new Set();

  // YouTube віддає плейлист двома способами залежно від версії верстки:
  // новий lockupViewModel і старий playlistVideoRenderer. Пробуємо обидва.
  const patterns = [
    /\{"lockupViewModel":\{.*?"contentId":"([\w-]{11})".*?"lockupMetadataViewModel":\{"title":\{"content":"((?:[^"\\]|\\.)*)"/g,
    /"playlistVideoRenderer":\{"videoId":"([\w-]{11})".*?"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/g,
  ];

  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      const [, id, rawTitle] = m;
      if (seen.has(id)) continue;
      seen.add(id);
      let title = rawTitle;
      try {
        title = JSON.parse(`"${rawTitle}"`);
      } catch {
        // лишаємо як є
      }
      videos.push({ id, title });
    }
    if (videos.length) break;
  }

  return videos;
}

// ─── supabase ────────────────────────────────────────────────
async function sb(path, init = {}) {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// ─── головне ─────────────────────────────────────────────────
const [videos, modules] = await Promise.all([
  fetchPlaylist(playlistUrl),
  sb("modules?select=id,slug,number,title,lessons(id,slug,title,position,video_id)&order=position"),
]);

if (!videos.length) {
  console.error(
    "✖ Не вдалося прочитати жодного відео.\n" +
    "  Перевір, що плейлист доступний за посиланням (не приватний)."
  );
  process.exit(1);
}

// Уроки в тому ж порядку, що й у кабінеті.
const lessons = modules
  .sort((a, b) => a.number.localeCompare(b.number))
  .flatMap((m) =>
    [...m.lessons]
      .sort((a, b) => a.position - b.position)
      .map((l) => ({ ...l, moduleNumber: m.number, moduleTitle: m.title }))
  );

console.log(`\nВідео в плейлисті: ${videos.length}`);
console.log(`Уроків у курсі:    ${lessons.length}\n`);

if (videos.length !== lessons.length) {
  console.log(
    `⚠ Кількість не збігається — зіставлю перші ${Math.min(videos.length, lessons.length)}.\n` +
    `  Решту треба буде проставити вручну.\n`
  );
}

const pairs = [];
for (let i = 0; i < Math.min(videos.length, lessons.length); i++) {
  pairs.push({ lesson: lessons[i], video: videos[i] });
}

let lastModule = "";
for (const { lesson, video } of pairs) {
  if (lesson.moduleNumber !== lastModule) {
    lastModule = lesson.moduleNumber;
    console.log(`\n  ── ${lesson.moduleNumber} ${lesson.moduleTitle}`);
  }
  const mark = lesson.video_id ? "↻" : "+";
  console.log(`  ${mark} ${lesson.title.slice(0, 52).padEnd(54)} ← ${video.id}`);
  console.log(`    ${video.title.slice(0, 70)}`);
}

if (!apply) {
  console.log(
    `\n─────────────────────────────────────────────\n` +
    `Це попередній перегляд. Перевір, чи відео стали навпроти\n` +
    `правильних уроків, і якщо так — запусти ще раз із --apply:\n\n` +
    `  node scripts/link-videos.mjs "${playlistUrl}" --apply\n`
  );
  process.exit(0);
}

console.log("\nЗаписую в базу…");
let ok = 0;
for (const { lesson, video } of pairs) {
  await sb(`lessons?id=eq.${lesson.id}`, {
    method: "PATCH",
    body: JSON.stringify({ video_id: video.id, video_provider: "youtube" }),
  });
  ok++;
}
console.log(`✓ Готово: підключено ${ok} уроків.\n`);
