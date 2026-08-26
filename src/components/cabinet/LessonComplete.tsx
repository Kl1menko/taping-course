"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/cabinet/Spinner";

export default function LessonComplete({
  lessonId,
  initialDone,
  compact = false,
}: {
  lessonId: string;
  initialDone: boolean;
  /** Варіант для липкої панелі на мобільних: тягнеться на всю ширину. */
  compact?: boolean;
}) {
  const [done, setDone] = useState(initialDone);
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = !done;
    setDone(next); // оптимістично
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: next,
        completed_at: next ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

    setSaving(false);
    if (error) {
      setDone(!next); // відкат
      return;
    }
    startTransition(() => router.refresh());
  }

  const busy = saving || isPending;

  // min-h-12 — дотикова ціль не менша за рекомендовані 44px.
  const base = compact
    ? "flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-full px-4 text-[13px]"
    : "inline-flex min-h-12 items-center gap-3 rounded-full px-7 text-sm";

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-pressed={done}
      className={`${base} font-bold uppercase tracking-wide transition disabled:opacity-60 ${
        done
          ? "bg-lime text-ink"
          : "border border-ink/15 bg-white active:bg-ink active:text-white sm:hover:bg-ink sm:hover:text-white"
      }`}
    >
      {busy ? (
        <Spinner className="h-5 w-5 shrink-0" label="Зберігаємо" />
      ) : (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            done ? "border-ink bg-ink text-lime" : "border-current text-transparent"
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
               strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
      )}
      <span className="truncate">{done ? "пройдено" : "позначити пройденим"}</span>
    </button>
  );
}
