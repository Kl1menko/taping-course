import { included } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";
import { BentoCard, BentoGlyph, BentoText, BentoTitle } from "./BentoCard";

// Рівна сітка 3×2: шість однакових карток у два рядки.
// Раніше спани 3+3 / 2+2+2 давали 14 колонок на шести, через що
// остання картка зривалась у третій рядок сама.
export default function Included() {
  return (
    // Фон на всю ширину екрана, без бічних полів. Нижній відступ
    // повернуто: між цією плитою й FinalCta тепер стоїть світла
    // секція кабінету, тож притискати темне до темного більше
    // немає до чого.
    <section id="included" className="py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {included.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.items.map((item, i) => {
            const isLime = i % 3 === 1;
            return (
              <Reveal key={item.name} delay={i * 70} className="h-full">
                <BentoCard tone="dark" className="items-center text-center">
                  <BentoGlyph accent={isLime ? "lime" : "blue"} size="lg">
                    <MedicalIcon
                      name={item.icon as MedicalIconName}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    />
                  </BentoGlyph>
                  <BentoTitle className="mt-5 text-white">
                    {item.name}
                  </BentoTitle>
                  <BentoText tone="dark" className="mt-2.5">
                    {item.text}
                  </BentoText>
                </BentoCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={400}>
          <p className="mx-auto mt-14 max-w-3xl text-center text-2xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-3xl">
            {included.stackTitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
