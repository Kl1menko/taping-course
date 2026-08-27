import { objections } from "@/content";
import { Reveal } from "./ui";
import { BentoCard, BentoKicker, BentoText, BentoTitle } from "./BentoCard";

// Бенто на 6 колонок під 6 заперечень: 3+3, 2+2+2.
const SPAN = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export default function Objections() {
  return (
    <section id="objections" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {objections.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {objections.items.map((item, i) => {
            const span = SPAN[i] ?? "lg:col-span-2";
            const wide = span !== "lg:col-span-2";
            const isLime = i % 3 === 1;
            return (
              <Reveal key={item.no} delay={i * 70} className={`h-full ${span}`}>
                <BentoCard>
                  {/* Заперечення — заголовок картки: саме його читач
                      шукає очима, а не відповідь. */}
                  <BentoTitle className={wide ? "sm:text-2xl" : ""}>{item.no}</BentoTitle>

                  {/* Відповідь відбита кольоровою рискою — той самий
                      носій акценту, що й пілюлі в решті карток. */}
                  <div className="mt-auto pt-6">
                    <span
                      className={`block h-[3px] w-10 rounded-full ${
                        isLime ? "bg-lime" : "bg-blue"
                      }`}
                      aria-hidden="true"
                    />
                    <BentoKicker className="mt-4">Насправді</BentoKicker>
                    <BentoText className="mt-2">{item.yes}</BentoText>
                  </div>
                </BentoCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
