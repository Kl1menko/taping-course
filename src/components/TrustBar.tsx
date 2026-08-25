import { trustBar } from "@/content";
import { MedicalIcon, type MedicalIconName } from "./icons";
import { Reveal } from "./ui";

export default function TrustBar() {
  return (
    <section className="py-12 sm:py-16">
      <div className="wrap">
        <Reveal>
          <div className="rounded-4xl border border-ink/10 bg-white p-7 sm:p-10">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-ink/40">
              {trustBar.title}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trustBar.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3.5 rounded-3xl bg-ink/[0.03] px-5 py-4 transition-colors duration-300 hover:bg-ink/[0.06]"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-ink"
                    aria-hidden="true"
                  >
                    <MedicalIcon
                      name={item.icon as MedicalIconName}
                      className="h-[20px] w-[20px]"
                    />
                  </span>
                  <span className="text-sm font-bold leading-snug">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
