import Image from "next/image";
import { cabinet } from "@/content";
import { Reveal } from "./ui";

// ── Промо кабінету ──
//
// Праворуч — справжній скриншот кабінету в макеті телефона
// (public/cabinet/phone.png). Малювати інтерфейс заново на CSS
// сенсу немає: тут видно те, що людина отримає насправді, і
// оновлюється воно заміною одного файлу.
//
// Фон у файлі повністю прозорий і обрізаний по межах корпусу,
// тому підкладки під ним не треба. Віддається через next/image:
// 211 КБ PNG перетворюються на ~15 КБ webp потрібної ширини.

export default function Cabinet() {
  return (
    // Відступ знизу є на всіх ширинах: далі йде яскраво-синій
    // FinalCta, і без повітря світлий мокап телефону врізався
    // в нього різкою межею.
    <section id="cabinet" className="bg-white overflow-hidden pt-16 pb-10 sm:pt-24 sm:pb-14 lg:pb-24">
      <div className="wrap">
        <div className="mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          {/* ── текст і переваги ── */}
          <div>
            <Reveal>
              <p className="text-[11px] font-black uppercase tracking-widest text-ink/40">
                {cabinet.kicker}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                {cabinet.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
                {cabinet.text}
              </p>
            </Reveal>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {cabinet.features.map((f, i) => (
                <Reveal key={f.title} delay={80 + i * 70} className="h-full">
                  <div className="flex h-full gap-3.5 rounded-[1.5rem] border border-ink/10 bg-white p-4 sm:p-5">
                    {/* Галочки замість тематичних іконок: тут перелік
                        того, що вже працює, а не чотири різні теми —
                        однаковий знак читається як список переваг. */}
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-ink"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
                           strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black uppercase leading-tight tracking-tight">
                        {f.title}
                      </span>
                      <span className="mt-1.5 block text-[13px] leading-relaxed text-ink/55">
                        {f.text}
                      </span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── справжній кабінет у телефоні ── */}
          <Reveal delay={140}>
            {/* Знімок — горизонтальний кроп, де телефон обрізаний
                знизу й праворуч, тож він не стоїть окремою карткою,
                а «виїжджає» з краю: зріз читається як задум.
                На мобільному розтягуємо на всю ширину екрана —
                -mx-* гасить бічні поля .wrap, які інакше лишали б
                телефон у вузькій колонці. Секція має overflow-hidden. */}
            <div
              className="relative -mx-[10px] flex lg:mx-0 lg:-mr-16"
              style={{
                maskImage:
                  "linear-gradient(to bottom, #000 82%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 82%, transparent 100%)",
              }}
            >
              <Image
                src="/cabinet/phone.png"
                alt="Кабінет курсу на телефоні: прогрес «1 з 24 уроків» і кнопка «продовжити» з наступним уроком"
                width={1245}
                height={845}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full lg:max-w-[560px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
