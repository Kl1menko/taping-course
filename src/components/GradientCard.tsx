import { MedicalIcon, type MedicalIconName } from "./icons";
import { BentoCard, BentoGlyph, BentoText, BentoTitle } from "./BentoCard";

// Картка «для кого»: велика кругла іконка, заголовок, опис.

export default function GradientCard({
  index,
  title,
  text,
  icon,
  /** Широка плитка бенто — заголовок і іконка ростуть разом із нею. */
  wide = false,
}: {
  index: number;
  title: string;
  text: string;
  icon: string;
  wide?: boolean;
}) {
  const isLime = index % 3 === 1;

  return (
    <BentoCard className="items-center text-center">
      <BentoGlyph accent={isLime ? "lime" : "blue"} size="lg">
        <MedicalIcon
          name={icon as MedicalIconName}
          className="h-8 w-8 sm:h-9 sm:w-9"
        />
      </BentoGlyph>

      <BentoTitle className={`mt-5 ${wide ? "sm:text-2xl" : ""}`}>{title}</BentoTitle>
      <BentoText className="mt-2.5">{text}</BentoText>
    </BentoCard>
  );
}
