import { evidence } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon } from "./icons";
import { BentoGlyph, BentoText, BentoTitle } from "./BentoCard";
import FloatingGradient from "./FloatingGradient";

export default function Evidence() {
  return (
    // relative + isolate: градієнт лежить абсолютом усередині секції
    // і не повинен вилазити під сусідні блоки.
    <section id="evidence" className="relative isolate overflow-hidden py-24 sm:py-36">
      <FloatingGradient />

      {/* Без картки: текст лежить просто на градієнті, як у зразку.
          Плита тут лише глушила б сам ефект, заради якого секція й темна. */}
      <div className="wrap relative">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center text-white">
            <BentoGlyph accent="lime" size="lg">
              <MedicalIcon name="dna" className="h-8 w-8 sm:h-9 sm:w-9" />
            </BentoGlyph>
            <BentoTitle className="mt-8 text-2xl sm:text-4xl">
              {evidence.title}
            </BentoTitle>
            <BentoText tone="dark" className="mt-5 max-w-2xl sm:text-base">
              {evidence.text}
            </BentoText>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
