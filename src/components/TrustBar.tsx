import { trustBar } from "@/content";
import { Reveal } from "./ui";
import TrustCard from "./TrustCard";

// Рівна сітка 3×2: шість однакових карток у два рядки.
// Раніше тут було бенто зі спанами 3+3 / 2+2+2+2 — сума 14 на шести
// колонках, тому шоста картка зривалась у третій рядок сама.
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

        <div className="mx-auto mt-8 grid max-w-6xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {trustBar.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 70} className="h-full">
              <TrustCard index={i} icon={item.icon} label={item.label} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
