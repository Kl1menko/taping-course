// Кружок завантаження. SVG, а не бордер-трюк: так товщина лінії
// не пливе на різних розмірах, а кінці лишаються заокругленими.
export default function Spinner({
  className = "",
  label = "Завантаження",
}: {
  className?: string;
  /** Текст для скрін-рідерів; на екрані кружок сам по собі нічого не каже. */
  label?: string;
}) {
  return (
    <span role="status" aria-live="polite" className={`inline-flex ${className}`}>
      <svg viewBox="0 0 50 50" className="h-full w-full animate-spin-slow">
        {/* Бліде кільце — доріжка, по якій біжить дуга. */}
        <circle
          cx="25" cy="25" r="20" fill="none"
          stroke="currentColor" strokeWidth="5" className="opacity-15"
        />
        {/* Дуга приблизно на чверть кола. */}
        <circle
          cx="25" cy="25" r="20" fill="none"
          stroke="currentColor" strokeWidth="5" strokeLinecap="round"
          strokeDasharray="31 126"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
