"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LessonComplete({
  lessonId,
  initialDone,
}: {
  lessonId: string;
  initialDone: boolean;
}) {
  const [done, setDone] = useState(initialDone);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = !done;
    setDone(next); // оптимістично

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

    if (error) {
      setDone(!next); // відкат
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition disabled:opacity-60 ${
        done
          ? "bg-lime text-ink"
          : "border border-ink/15 hover:bg-ink hover:text-white"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          done ? "border-ink bg-ink text-lime" : "border-current text-transparent"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
             strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </span>
      {done ? "пройдено" : "позначити пройденим"}
    </button>
  );
}
