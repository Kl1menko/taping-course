import { contacts } from "@/content";
import { Arrow, InstagramIcon, Reveal, SectionTitle, TelegramIcon } from "./ui";

const ICONS = {
  telegram: TelegramIcon,
  instagram: InstagramIcon,
} as const;

export default function Contacts() {
  return (
    <section id="contacts" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <SectionTitle highlight="КОНТАКТИ" />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          {contacts.channels.map((c, i) => {
            const Icon = ICONS[c.icon as keyof typeof ICONS];
            const dark = c.tone === "dark";
            return (
              <Reveal key={c.label} delay={i * 90} className="h-full">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex h-full flex-col items-center rounded-[1.75rem] p-8 text-center transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/10 sm:p-10 ${
                    dark ? "bg-ink" : "bg-lime"
                  }`}
                >
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110 ${
                      dark ? "bg-white/[0.08] text-lime" : "bg-ink/10 text-ink"
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </span>

                  <span
                    className={`mt-6 text-xs font-bold uppercase tracking-widest ${
                      dark ? "text-white/45" : "text-ink/50"
                    }`}
                  >
                    {c.label}
                  </span>

                  <span
                    className={`mt-2 text-xl font-extrabold tracking-tight ${
                      dark ? "text-white" : "text-ink"
                    }`}
                  >
                    {c.value}
                  </span>

                  <span
                    className={`mt-3 text-sm leading-relaxed ${
                      dark ? "text-white/50" : "text-ink/60"
                    }`}
                  >
                    {c.note}
                  </span>

                  <span
                    className={`mt-7 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${
                      dark ? "bg-lime text-ink" : "bg-ink text-lime"
                    }`}
                    aria-hidden="true"
                  >
                    <Arrow className="h-4 w-4" />
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
