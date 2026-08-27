import { brand, footer, nav } from "@/content";

// ── Підвал ──
//
// Темний (ink), а не синій: одразу над ним лежить синя плита
// «Контакти», і ще один синій блок читався б як її продовження.
// Темний хвіст замикає сторінку й відбиває контакти, лишаючись
// у тій самій палітрі — лаймові акценти ті самі, що всюди.

const SOCIALS = [
  { label: "Telegram", href: brand.telegram },
  { label: "Instagram", href: brand.instagram },
  { label: "TikTok", href: brand.tiktok },
];

// Спільний вигляд для посилань-пігулок у навігації та соцмережах.
const pill =
  "inline-block rounded-full border border-white/20 px-3 py-1 text-[13px] text-white/80 transition hover:border-lime hover:bg-lime hover:text-ink";

const heading =
  "text-[11px] font-black uppercase tracking-widest text-white/45";

export default function Footer() {
  return (
    <footer className="px-[10px] pb-[10px]">
      <div className="w-full rounded-[2.5rem] bg-ink px-6 py-10 sm:rounded-[3.5rem] sm:px-10 sm:py-12 lg:px-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span
              className="block text-2xl font-black uppercase leading-none tracking-tighter text-white sm:text-3xl"
              style={{ fontFamily: '"Arial Black", Impact, system-ui, sans-serif' }}
            >
              {brand.name}
            </span>
            <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-white/60">
              {brand.tagline}
            </p>
            <a
              href={brand.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-lg font-extrabold text-lime transition hover:underline"
            >
              {brand.telegramHandle}
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="mt-1 block text-sm text-white/70 transition hover:text-white hover:underline"
            >
              {brand.email}
            </a>
          </div>

          <nav aria-label="Розділи сайту">
            <h2 className={heading}>Навігація</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={pill}>
                    {n.label}
                  </a>
                </li>
              ))}
              {/* Вхід для тих, хто вже купив курс. */}
              <li>
                <a href="/cabinet" className={pill}>
                  Кабінет
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={heading}>Соцмережі</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pill}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className={`mt-6 ${heading}`}>Документи</h2>
            <ul className="mt-3 space-y-1.5">
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/70 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-5">
          <p className="text-xs leading-relaxed text-white/60">
            {footer.disclaimer}
          </p>
          <p className="mt-2 text-xs text-white/45">{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
