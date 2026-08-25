import Image from "next/image";
import { author } from "@/content";
import { Reveal } from "./ui";

export default function Author() {
  return (
    <section id="author" className="px-[10px] py-16 sm:py-24">
      <div className="w-full overflow-hidden bg-pink-soft">
        <div className="grid items-center gap-10 p-6 sm:p-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-14 lg:p-16">
          <Reveal>
            <div className="relative">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-4xl shadow-2xl shadow-pink-deep/20 lg:max-w-none">
                <Image
                  src="/about.jpg"
                  alt="Викладачка курсу у своєму кабінеті"
                  fill
                  sizes="(min-width: 1024px) 32vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-3xl bg-lime px-6 py-4 shadow-xl sm:-right-5">
                <span className="block text-2xl font-extrabold leading-none">12</span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider">
                  років практики
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-pink-deep">
                {author.kicker}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl md:text-5xl">
                {author.name}
              </h2>
              <p className="mt-2 text-base text-ink/60">{author.role}</p>

              <div className="mt-7 space-y-4">
                {author.bio.map((p) => (
                  <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-ink/75 sm:text-base">
                    {p}
                  </p>
                ))}
              </div>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {author.facts.map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold sm:text-sm"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
