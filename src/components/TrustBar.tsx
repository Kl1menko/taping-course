import { trustBar } from "@/content";
import { Reveal } from "./ui";
import TrustCard from "./TrustCard";

export default function TrustBar() {
  return (
    <section className="py-12 sm:py-16">
      <div className="wrap">
        <Reveal>
          {/* Зовнішньої білої картки більше немає: світлі картки
              всередині неї читались як білий на білому. */}
          <p className="text-center text-xs font-bold uppercase tracking-widest text-ink/40">
            {trustBar.title}
          </p>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
