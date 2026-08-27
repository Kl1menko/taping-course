// Мальована стрілка між картками — деталь зі зразка: підказує, що
// картки читаються як послідовність, а не як набір рівноправних плиток.
// Позиціонується абсолютно всередині картки-попередниці, тому в потоці
// сітки місця не займає й на мобільному просто ховається.

export default function ScribbleArrow({
  className = "",
  tone = "ink",
}: {
  className?: string;
  /** lime — на темному фоні, ink — на світлому. */
  tone?: "ink" | "lime";
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`pointer-events-none overflow-visible stroke-current ${
        tone === "lime" ? "text-lime" : "text-ink"
      } ${className}`}
      fill="none"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20,80 Q 40,20 80,40" />
      <path d="M60,20 L80,40 L50,60" />
    </svg>
  );
}
