import { evidence } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon } from "./icons";
import { BentoCard, BentoGlyph, BentoText, BentoTitle } from "./BentoCard";

export default function Evidence() {
  return (
    <section id="evidence" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <BentoCard className="items-center p-8 text-center sm:p-12">
              <BentoGlyph accent="lime" size="lg">
                <MedicalIcon name="dna" className="h-8 w-8 sm:h-9 sm:w-9" />
              </BentoGlyph>
              <BentoTitle className="mt-6 text-2xl sm:text-3xl">
                {evidence.title}
              </BentoTitle>
              <BentoText className="mt-5 sm:text-base">{evidence.text}</BentoText>
            </BentoCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
