import { brand, objections } from "@/content";
import { Reveal } from "./ui";

// ── Заперечення у вигляді переписки ──
//
// Пари no/yes лягають на чат майже дослівно: сумнів — це вхідне
// повідомлення ліворуч, відповідь — вихідне праворуч. Бенто-сітка
// показувала ті самі пари як шість рівноправних плиток, і діалог,
// заради якого писався текст, у ній не читався.
//
// Це декоративна стилізація, а не справжній месенджер: розмітка
// лишається списком, а «інтерфейсні» дрібниці (аватар, галочки,
// час) сховані від скрінрідерів.

// Час у бульбашках — суто декор. Фіксований масив, а не new Date():
// час рендеру на сервері й на клієнті різний, і React лаявся б на
// розбіжність розмітки.
const TIMES = ["09:41", "09:41", "09:42", "09:44", "09:47", "09:51"];

/** Дві сірі галочки «прочитано» — деталь, що робить чат упізнаваним. */
function ReadTicks() {
  return (
    <svg
      viewBox="0 0 20 12"
      aria-hidden="true"
      className="h-3 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 6.5 4.5 10 11 2" />
      <path d="M8.5 8.5 10 10 16.5 2" />
    </svg>
  );
}

export default function Objections() {
  return (
    <section id="objections" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {objections.title}
            </h2>
          </div>
        </Reveal>

        {/* Вікно чату. max-w-2xl, а не 6xl: широка переписка виглядає
            неприродно — бульбашки мусять лишатися вузькими. */}
        <Reveal delay={80}>
          <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-xl sm:rounded-[2rem]">
            {/* ── Шапка діалогу ── */}
            <div className="flex items-center gap-3 border-b border-ink/10 bg-cream/60 px-5 py-4 backdrop-blur">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-black text-white"
              >
                {brand.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold tracking-tight">
                  {brand.name}
                </p>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink/45">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-lime ring-2 ring-lime/30"
                  />
                  онлайн
                </p>
              </div>
            </div>

            {/* ── Стрічка повідомлень ── */}
            <ul className="space-y-4 px-4 py-6 sm:px-6 sm:py-8">
              {objections.items.map((item, i) => (
                <li key={item.no} className="space-y-2">
                  {/* Сумнів — вхідне повідомлення ліворуч */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-3xl rounded-bl-lg bg-ink/[0.06] px-4 py-3 sm:max-w-[75%]">
                      <p className="text-[14px] font-semibold leading-relaxed text-ink/80">
                        {item.no}
                      </p>
                      <p
                        aria-hidden="true"
                        className="mt-1 text-right text-[10px] font-semibold text-ink/45"
                      >
                        {TIMES[i % TIMES.length]}
                      </p>
                    </div>
                  </div>

                  {/* Відповідь — вихідне повідомлення праворуч.
                      Синя заливка й галочки читаються як «наша» репліка. */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-blue px-4 py-3 shadow-sm sm:max-w-[75%]">
                      <p className="text-[14px] font-semibold leading-relaxed text-white">
                        {item.yes}
                      </p>
                      <p
                        aria-hidden="true"
                        className="mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold text-white/75"
                      >
                        {TIMES[i % TIMES.length]}
                        <ReadTicks />
                      </p>
                    </div>
                  </div>
                </li>
              ))}

              {/* Індикатор набору — натяк, що розмова триває
                  і питання можна поставити своє. */}
              <li className="flex justify-start pt-1">
                <div
                  aria-hidden="true"
                  className="flex items-center gap-1.5 rounded-3xl rounded-bl-lg bg-ink/[0.06] px-4 py-3.5"
                >
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="h-2 w-2 animate-bounce rounded-full bg-ink/30"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </li>
            </ul>

            {/* ── Поле вводу: декор, який веде в реальний Telegram ── */}
            <div className="border-t border-ink/10 bg-cream/60 px-4 py-3.5 sm:px-6">
              <a
                href={brand.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-full border border-ink/10 bg-white py-2.5 pl-5 pr-2.5 transition hover:border-blue/40"
              >
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink/55">
                  Залишилось питання? Напишіть нам…
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M21.9 4.3 18.6 20a1.2 1.2 0 0 1-1.9.7l-4.4-3.2-2.1 2a.8.8 0 0 1-1.3-.4l-1.6-5.3-4.4-1.4c-.9-.3-.9-1.5 0-1.8l17.3-6.7c.8-.3 1.6.4 1.7 1.4Z" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
