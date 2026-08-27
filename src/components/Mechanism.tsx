import { mechanism } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";
import { BentoCard, BentoGlyph, BentoPill, BentoText, BentoTitle } from "./BentoCard";
import ScribbleArrow from "./ScribbleArrow";

// Бенто на 6 колонок під 4 кроки: 4+2 у першому рядку, 2+4 у другому.
// Дзеркальні рядки — найдешевший спосіб не дати сітці читатись таблицею.
const SPAN = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4"];

export default function Mechanism() {
  return (
    <section id="mechanism" className="px-[10px] py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {mechanism.title}
            </h2>
          </div>
        </Reveal>

        <ol className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {mechanism.steps.map((step, i) => {
            const span = SPAN[i] ?? "lg:col-span-3";
            const wide = span === "lg:col-span-4";
            const isLime = i % 2 === 0;
            return (
              <Reveal key={step.n} delay={i * 90} className={`h-full ${span}`}>
                {/* На темній секції плита світлішає — сірої тут не буває. */}
                <BentoCard as="li" tone="dark" className="relative z-0 items-center text-center">
                  <BentoTitle className={`text-white ${wide ? "text-xl sm:text-3xl" : "sm:text-xl"}`}>
                    {step.name}
                  </BentoTitle>
                  <BentoText tone="dark" className="mt-2.5">
                    {step.text}
                  </BentoText>

                  {/* Пілюля з номером кроку — той самий носій кольору,
                      що і в решті карток сторінки. */}
                  <div className="mt-auto flex w-full justify-center pt-7">
                    <BentoPill accent={isLime ? "lime" : "blue"}>
                      <BentoGlyph accent={isLime ? "soft-light" : "soft-dark"} size="sm">
                        <MedicalIcon
                          name={step.icon as MedicalIconName}
                          className="h-5 w-5"
                        />
                      </BentoGlyph>
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        крок {step.n}
                      </span>
                    </BentoPill>
                  </div>

                  {/* Три розкладки — три напрямки стрілки, видима
                      завжди рівно одна:
                        <sm  одна колонка → вниз, у проміжок;
                        sm   дві колонки  → праворуч у парі [0,1] [2,3];
                        lg   бенто на 6   → праворуч, як було.
                      Останній крок (4) стрілки не отримує в жодній
                      розкладці — вести її нема куди. */}
                  {i < mechanism.steps.length - 1 && (
                    <ScribbleArrow
                      tone="lime"
                      className="absolute -bottom-[22px] left-1/2 z-10 h-7 w-7 -translate-x-1/2 rotate-90 sm:hidden"
                    />
                  )}

                  {i % 2 === 0 && (
                    <ScribbleArrow
                      tone="lime"
                      className="absolute -right-[22px] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 sm:block lg:hidden"
                    />
                  )}

                  {i % 2 === 0 && (
                    <ScribbleArrow
                      tone="lime"
                      className="absolute -right-9 bottom-10 z-10 hidden h-12 w-12 lg:block"
                    />
                  )}
                </BentoCard>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={400}>
          <p className="mx-auto mt-12 max-w-2xl text-center text-base font-semibold text-white/80 sm:text-lg">
            {mechanism.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
