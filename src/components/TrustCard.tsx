import { MedicalIcon, type MedicalIconName } from "./icons";
import { BentoCard, BentoGlyph, BentoTitle } from "./BentoCard";

// Найдрібніша картка сторінки: іконка + короткий підпис, більше нічого.

export default function TrustCard({
  index,
  label,
  icon,
}: {
  index: number;
  label: string;
  icon: string;
}) {
  const isLime = index % 3 === 1;

  return (
    // На телефоні — горизонтальний рядок: шість вертикальних карток
    // розтягувались на кілька екранів скролу.
    <BentoCard className="flex-row items-center gap-4 p-4 sm:flex-col sm:justify-center sm:gap-4 sm:p-7 sm:text-center">
      <BentoGlyph accent={isLime ? "lime" : "blue"} size="md">
        <MedicalIcon name={icon as MedicalIconName} className="h-6 w-6 sm:h-7 sm:w-7" />
      </BentoGlyph>

      <BentoTitle className="min-w-0 flex-1 text-[15px] sm:flex-none sm:text-base">
        {label}
      </BentoTitle>
    </BentoCard>
  );
}
