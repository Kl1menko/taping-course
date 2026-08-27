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
  /** Не остання картка в рядку на lg — праворуч від неї йде стрілка. */
  withArrow = false,
  /** Не остання картка взагалі — під нею є куди вести стрілку вниз. */
  withArrowDown = false,
  /** Не остання картка в рядку на sm (двоколонковій сітці). */
  withArrowRightSm = false,
  /** Широка плитка бенто. */
  wide = false,
}: {
  index: number;
  verb: string;
  text: string;
  icon: string;
  withArrow?: boolean;
  withArrowDown?: boolean;
  withArrowRightSm?: boolean;
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

      {/* Три розкладки — три різні напрямки стрілки, і в кожен момент
          видима лише одна:
            <sm  одна колонка   → вниз, у проміжок під карткою;
            sm   дві колонки    → праворуч, до сусідки в парі;
            lg   бенто на 6     → праворуч, як було.
          Стрілка живе в проміжку сітки (gap-4 = 16px), тому винесена
          за межі картки від'ємним відступом і не займає місця в потоці. */}
      {/* Розмір і зсув підібрані під gap-4 (16px): стрілка h-7 (28px),
          зсунута на 22px, виступає в проміжок і майже не заходить на
          сусідню картку — інакше вона лягала б поверх її кута. */}
      {withArrowDown && (
        <ScribbleArrow className="absolute -bottom-[22px] left-1/2 z-10 h-7 w-7 -translate-x-1/2 rotate-90 sm:hidden" />
      )}

      {withArrowRightSm && (
        <ScribbleArrow className="absolute -right-[22px] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 sm:block lg:hidden" />
      )}

      {withArrow && (
        <ScribbleArrow className="absolute -right-9 bottom-10 z-10 hidden h-12 w-12 lg:block" />
      )}
    </BentoCard>
  );
}
