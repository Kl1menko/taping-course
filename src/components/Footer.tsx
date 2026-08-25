import { brand, footer, nav } from "@/content";

const SOCIALS = [
  { label: "Telegram", href: brand.telegram },
  { label: "Instagram", href: brand.instagram },
];

export default function Footer() {
  return (
    <footer className="px-[10px] pb-[10px]">
      <div className="w-full bg-pink px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
              {brand.nameFull}
            </span>
            <p className="mt-3 max-w-xs text-sm text-ink/65">{brand.tagline}</p>
            <a
              href={brand.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-xl font-bold hover:underline"
            >
              {brand.telegramHandle}
            </a>
            <a href={`mailto:${brand.email}`} className="mt-1 block text-sm text-ink/70 hover:underline">
              {brand.email}
            </a>
          </div>

          <nav aria-label="Розділи сайту">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-ink/45">Навігація</h2>
            <ul className="mt-4 space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="inline-block rounded-full border border-ink/20 px-4 py-1.5 text-sm transition hover:bg-ink hover:text-white"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-ink/45">Соцмережі</h2>
            <ul className="mt-4 space-y-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-ink/20 px-4 py-1.5 text-sm transition hover:bg-ink hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-[11px] font-bold uppercase tracking-widest text-ink/45">Документи</h2>
            <ul className="mt-4 space-y-2">
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-ink/70 underline-offset-4 hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/15 pt-6">
          <p className="text-xs text-ink/55">{footer.disclaimer}</p>
          <p className="mt-3 text-xs text-ink/45">{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
