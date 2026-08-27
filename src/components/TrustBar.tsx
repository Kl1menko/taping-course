import { trustBar } from "@/content";
import { Reveal } from "./ui";
import TrustCard from "./TrustCard";

// Бенто на 6 колонок і 6 карток: перша й четверта широкі (3 колонки),
// решта по 2. Рівні шість плиток 3×2 читались як таблиця — саме від
// цього бенто й рятує.
const SPAN = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export default function TrustBar() {
  return (
    // Біла плита з круглими кутами наїжджає на синій хіро — прийом зі
    // зразка: перехід між секціями читається як шар, а не як обрив.
    // -mt-* тягне її вгору, тінь угору відриває від фону.
    <section className="relative z-20 -mt-10 rounded-t-[2.5rem] bg-cream pb-12 pt-12 shadow-[0_-20px_50px_rgba(0,0,0,0.18)] sm:-mt-16 sm:rounded-t-[3.5rem] sm:pb-16 sm:pt-16">
      <div className="wrap">
        <Reveal>
          {/* Зовнішньої білої картки більше немає: світлі картки
              всередині неї читались як білий на білому. */}
          <p className="text-center text-xs font-bold uppercase tracking-widest text-ink/40">
            {trustBar.title}
          </p>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-6xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
          {trustBar.items.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 70}
              className={`h-full ${SPAN[i] ?? "lg:col-span-2"}`}
            >
              <TrustCard index={i} icon={item.icon} label={item.label} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
