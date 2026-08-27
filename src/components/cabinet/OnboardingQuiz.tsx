"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { qualification } from "@/content";
import Spinner from "@/components/cabinet/Spinner";

// Той самий квіз, що раніше стояв на лендінгу перед оплатою.
// Тут він уже не фільтр, а знайомство: людина курс купила,
// відповіді потрібні кураторові для перевірки домашніх робіт.
export default function OnboardingQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const questions = qualification.questions;
  const question = questions[step];
  const isLast = step === questions.length - 1;

  function pick(id: string, value: string) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    if (isLast) {
      void save(next);
      return;
    }
    setTimeout(() => setStep((s) => s + 1), 180);
  }

  async function save(final: Record<string, string>) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(final),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Не вдалося зберегти. Спробуй ще раз.");
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl bg-ink p-5 text-white sm:rounded-4xl sm:p-10">
      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-lime" : "bg-white/15"
            }`}
          />
        ))}
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-lime">
        крок {step + 1} з {questions.length}
      </p>

      {step === 0 && (
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Кілька питань перед стартом — щоб куратор розумів, з чим ти
          прийшла, і давав точніший фідбек на домашніх роботах.
        </p>
      )}

      <h2 className="mt-3 text-xl font-extrabold leading-snug tracking-tight sm:text-3xl">
        {question.label}
      </h2>

      {saving ? (
        <div className="mt-6 flex items-center gap-3 text-sm text-white/60">
          <Spinner className="h-5 w-5" />
          зберігаємо…
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => pick(question.id, opt)}
              className={`flex min-h-[52px] w-full items-center rounded-2xl border px-5 text-left text-[15px] transition sm:text-sm ${
                answers[question.id] === opt
                  ? "border-lime bg-lime text-ink"
                  : "border-white/15 active:border-white/40 active:bg-white/5 sm:hover:border-white/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-pink-deep">{error}</p>}

      {step > 0 && !saving && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="-ml-2 mt-4 inline-flex min-h-11 items-center px-2 text-xs font-bold uppercase tracking-widest text-white/40 transition active:text-white sm:hover:text-white"
        >
          ← назад
        </button>
      )}
    </section>
  );
}
