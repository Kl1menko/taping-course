import { MedicalIcon, type MedicalIconName } from "./icons";
import ScribbleArrow from "./ScribbleArrow";
import { BentoCard, BentoPill, BentoGlyph, BentoText, BentoTitle } from "./BentoCard";

// Картка результату: заголовок-дієслово згори, кольорова пілюля з
// номером кроку внизу — точно та роль, що в зразку.

export default function OutcomeCard({
  index,
  verb,
  text,
  icon,
  /** Не остання картка в рядку — між нею й наступною йде стрілка. */
  withArrow = false,
  /** Широка плитка бенто. */
  wide = false,
}: {
  index: number;
  verb: string;
  text: string;
  icon: string;
  withArrow?: boolean;
  wide?: boolean;
}) {
  // Кожна третя картка — лаймова, решта сині. Так сітка не читається
  // ані монотонною, ані строкатою.
  const isLime = index % 3 === 2;

  return (
    <BentoCard className="relative z-0 items-center text-center">
      <BentoTitle className={`text-xl sm:text-2xl ${wide ? "sm:text-3xl" : ""}`}>
        {verb}
      </BentoTitle>
      <BentoText className="mt-2 text-[11px] font-bold sm:text-xs">{text}</BentoText>

      <div className="mt-auto flex w-full justify-center pt-7">
        <BentoPill accent={isLime ? "lime" : "blue"}>
          <BentoGlyph accent={isLime ? "soft-light" : "soft-dark"} size="sm">
            <MedicalIcon name={icon as MedicalIconName} className="h-5 w-5" />
          </BentoGlyph>
          {/* Номер кроку, а не повтор заголовка: дублювати те саме
              слово двічі в одній картці — шум. */}
          <span className="text-[11px] font-black uppercase tracking-widest">
            крок {String(index + 1).padStart(2, "0")}
          </span>
        </BentoPill>
      </div>

      {withArrow && (
        <ScribbleArrow className="absolute -right-9 bottom-10 z-10 hidden h-12 w-12 lg:block" />
      )}
    </BentoCard>
  );
}
