import { trustBar } from "@/content";
import { MedicalIcon, type MedicalIconName } from "./icons";

export default function TrustBar() {
  return (
    <section className="border-y border-ink/10 bg-white/60">
      <div className="wrap py-8 sm:py-10">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-ink/40">
          {trustBar.title}
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {trustBar.items.map((item) => (
            <li key={item.label} className="flex flex-col items-center gap-2 text-center">
              <MedicalIcon
                name={item.icon as MedicalIconName}
                className="h-6 w-6 text-pink-deep"
              />
              <span className="text-xs font-semibold leading-snug sm:text-sm">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
