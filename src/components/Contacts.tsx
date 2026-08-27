import { brand, contacts } from "@/content";
import { Arrow, InstagramIcon, Reveal, TelegramIcon } from "./ui";

// ── Контакти в мові хіро ──
//
// Остання секція перед підвалом, тому вона й закриває композицію:
// синій із сіткою, масивний Arial Black, скляні картки. Раніше це
// був кремовий блок із двома заливними плитками — після того, як
// хіро, ціна й модалка перейшли в одну мову, він лишався єдиним
// чужим елементом у кінці сторінки.

const BLUE = "#0038FF";
const BLUE_DEEP = "#001A99";
const ACID = "#CCFF00";

const depth = (color: string, layers: number, step = 1) =>
  Array.from({ length: layers }, (_, i) => {
    const n = +((i + 1) * step).toFixed(2);
    return `${n}px ${n}px 0 ${color}`;
  }).join(", ");

const DEPTH = depth(BLUE_DEEP, 8);
const DEPTH_SM = depth(BLUE_DEEP, 8, 0.5);

const TikTokIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .7.1V9.5a5.9 5.9 0 0 0-.7 0 5.7 5.7 0 1 0 5.7 5.7V8.9a7 7 0 0 0 4 1.3V7.2a4 4 0 0 1-4-4Z" />
  </svg>
);

const ICONS = {
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
} as const;

// TikTok у contacts немає, але канал реальний і з найбільшою
// аудиторією — дописуємо його тут, а не в content.ts, щоб не
// чіпати структуру даних заради однієї картки.
const CHANNELS = [
  ...contacts.channels,
  {
    label: "TikTok",
    value: brand.tiktokHandle,
    href: brand.tiktok,
    note: `${brand.tiktokFollowers} підписників — короткі розбори технік`,
    icon: "tiktok",
  },
];

export default function Contacts() {
  return (
    // Круглі кути й бічні поля: секція лежить на кремовому фоні
    // сторінки й читається як окрема синя плита, так само як Offer.
    //
    // mt-* обов'язковий: одразу над контактами лежить Offer — теж
    // синя плита такого самого кольору. Без просвіту кремового фону
    // між ними дві секції зливаються в один довгий синій блок.
    <section
      id="contacts"
      className="relative mx-[10px] mt-3 overflow-hidden rounded-[2.5rem] py-16 sm:mt-4 sm:rounded-[3.5rem] sm:py-24"
      style={{ backgroundColor: BLUE }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <style>{`
        .contacts-depth { --depth: ${DEPTH_SM}; }
        @media (min-width: 640px) { .contacts-depth { --depth: ${DEPTH}; } }
      `}</style>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4">
        <Reveal>
          <div className="contacts-depth mx-auto max-w-3xl text-center">
            <h2
              className="text-[clamp(2.2rem,8vw,72px)] font-black uppercase leading-none tracking-tighter text-white"
              style={{
                fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
                textShadow: "var(--depth)",
              }}
            >
              {contacts.title}
            </h2>
            <p className="mt-6 text-base text-white/85 sm:text-lg">
              Пишіть у будь-який канал — відповідаємо особисто.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:mt-14 sm:grid-cols-3">
          {CHANNELS.map((c, i) => {
            const Icon = ICONS[c.icon as keyof typeof ICONS];
            return (
              <Reveal key={c.label} delay={i * 90} className="h-full">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col items-center rounded-[1.75rem] border border-white/40 bg-white/15 p-7 text-center shadow-2xl backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:bg-white/25 sm:rounded-[2.25rem] sm:p-8"
                >
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full text-ink transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundColor: ACID }}
                  >
                    <Icon className="h-7 w-7" />
                  </span>

                  <span className="mt-6 text-[11px] font-black uppercase tracking-widest text-white/70">
                    {c.label}
                  </span>

                  <span className="mt-2 text-lg font-extrabold tracking-tight text-white">
                    {c.value}
                  </span>

                  <span className="mt-3 text-sm leading-relaxed text-white/90">
                    {c.note}
                  </span>

                  {/* Обгортка з mt-auto притискає стрілку до низу
                      картки: підписи різної довжини інакше ставили б
                      її на різній висоті, і три картки виглядали б
                      неохайно. Відступ від тексту тримає pt-7 на
                      обгортці, а не трансформ на самій кнопці —
                      трансформ конфліктував би з rotate на ховері. */}
                  <span className="mt-auto pt-7">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-transform duration-300 group-hover:rotate-45"
                      style={{ backgroundColor: ACID }}
                      aria-hidden="true"
                    >
                      <Arrow className="h-4 w-4" />
                    </span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
