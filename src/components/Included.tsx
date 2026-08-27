import { included } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";
import { BentoCard, BentoGlyph, BentoText, BentoTitle } from "./BentoCard";

// Бенто на 6 колонок під 6 карток: 3+3, далі 2+2+2.
const SPAN = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export default function Included() {
  return (
    <section id="included" className="px-[10px] py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {included.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {included.items.map((item, i) => {
            const span = SPAN[i] ?? "lg:col-span-2";
            const wide = span !== "lg:col-span-2";
            const isLime = i % 3 === 1;
            return (
              <Reveal key={item.name} delay={i * 70} className={`h-full ${span}`}>
                <BentoCard tone="dark" className="items-center text-center">
                  <BentoGlyph accent={isLime ? "lime" : "blue"} size="lg">
                    <MedicalIcon
                      name={item.icon as MedicalIconName}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    />
                  </BentoGlyph>
                  <BentoTitle className={`mt-5 text-white ${wide ? "sm:text-2xl" : ""}`}>
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
