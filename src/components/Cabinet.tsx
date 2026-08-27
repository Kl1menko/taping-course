import Image from "next/image";
import { cabinet } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";

// ── Промо кабінету ──
//
// Праворуч — справжній скриншот кабінету в макеті телефона
// (public/cabinet/phone.png, фон прозорий). Малювати інтерфейс
// заново на CSS сенсу немає: тут видно те, що людина отримає
// насправді, і оновлюється воно заміною одного файлу.
//
// Вихідник важить ~2 МБ, тому віддаємо його через next/image:
// він сам віддасть webp потрібного розміру, а не оригінал.

export default function Cabinet() {
  return (
    <section id="cabinet" className="overflow-hidden py-16 sm:py-24">
      <div className="wrap">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
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
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue text-white"
                    >
                      <MedicalIcon
                        name={f.icon as MedicalIconName}
                        className="h-[18px] w-[18px]"
                      />
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
            {/* Знімок — горизонтальний кроп 4:3, де телефон обрізаний
                знизу й праворуч. Тому він не стоїть окремою карткою,
                а «виїжджає» з правого краю: -mr-* виводить обрізаний
                бік за межі колонки, і зріз читається як задум, а не
                як недоріз. Секція має overflow-hidden. */}
            <div className="relative -mr-4 mt-2 sm:-mr-8 lg:-mr-16 lg:mt-0">
              {/* Лаймова пляма за телефоном: на кремовому фоні знімок
                  із прозорим тлом інакше висить у порожнечі. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-8 left-1/4 right-0 -z-10 rounded-[3rem] bg-lime/30 blur-3xl"
              />
              <Image
                src="/cabinet/phone.png"
                alt="Кабінет курсу на телефоні: прогрес «1 з 24 уроків» і кнопка «продовжити» з наступним уроком"
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 460px, 340px"
                className="h-auto w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[560px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
