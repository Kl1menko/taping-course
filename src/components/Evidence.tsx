import { evidence } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon } from "./icons";

export default function Evidence() {
  return (
    <section id="evidence" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-4xl border border-ink/10 bg-white p-8 text-center sm:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime">
              <MedicalIcon name="dna" className="h-6 w-6 text-ink" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {evidence.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink/65 sm:text-base">
              {evidence.text}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
