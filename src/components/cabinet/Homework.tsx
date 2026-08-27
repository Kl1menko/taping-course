"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/cabinet/Spinner";
import type { Assignment, Submission, SubmissionStatus } from "@/lib/course-types";

type Photo = { path: string; url: string };

const STATUS: Record<SubmissionStatus, { label: string; className: string }> = {
  draft:     { label: "чернетка",         className: "bg-ink/5 text-ink/60" },
  submitted: { label: "на перевірці",     className: "bg-ink text-white" },
  accepted:  { label: "прийнято",         className: "bg-lime text-ink" },
  rework:    { label: "на доопрацювання",  className: "bg-pink-deep text-white" },
};

export default function Homework({
  assignment,
  submission,
  initialPhotos,
}: {
  assignment: Assignment;
  submission: Submission | null;
  /** Уже завантажені фото з підписаними посиланнями. */
  initialPhotos: Photo[];
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(submission?.text ?? "");
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [status, setStatus] = useState<SubmissionStatus | null>(
    submission?.status ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Прийняту роботу не чіпаємо — редагування зламало б вердикт куратора.
  const locked = status === "accepted";
  const canSubmit =
    !locked && text.trim().length > 0 && photos.length >= assignment.min_photos;

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // щоб те саме фото можна було обрати вдруге
    if (!files.length) return;

    const room = assignment.max_photos - photos.length;
    if (room <= 0) {
      setError(`Максимум ${assignment.max_photos} фото`);
      return;
    }

    setUploading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      setError("Сесія завершилась — онови сторінку");
      return;
    }

    const added: Photo[] = [];
    for (const file of files.slice(0, room)) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`«${file.name}» більше за 10 МБ`);
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${user.id}/${assignment.lesson_id}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("homework")
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        setError("Не вдалося завантажити фото. Спробуй ще раз.");
        continue;
      }

      const { data: signed } = await supabase.storage
        .from("homework")
        .createSignedUrl(path, 60 * 60);
      added.push({ path, url: signed?.signedUrl ?? "" });
    }

    setPhotos((p) => [...p, ...added]);
    setUploading(false);
  }

  async function removePhoto(path: string) {
    setPhotos((p) => p.filter((x) => x.path !== path));
    const supabase = createClient();
    await supabase.storage.from("homework").remove([path]);
  }

  async function save(submit: boolean) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: assignment.lesson_id,
          text,
          photos: photos.map((p) => p.path),
          submit,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "error");
      setStatus(json.status as SubmissionStatus);
      // Здача відкриває наступний урок — серверні компоненти мають це побачити.
      if (submit) router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося зберегти");
    } finally {
      setSaving(false);
    }
  }

  const badge = status ? STATUS[status] : null;
  const busy = saving || uploading;

  return (
    <section id="homework" className="mt-10 rounded-3xl border border-ink/10 bg-white p-5 sm:mt-12 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight sm:text-2xl">
          {assignment.title}
        </h2>
        {badge && (
          <span className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>

      <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/70">
        {assignment.brief}
      </p>

      {assignment.is_required && status === null && (
        <p className="mt-3 text-[13px] font-semibold text-ink/45">
          Наступний урок відкриється після здачі цієї роботи.
        </p>
      )}

      {/* Коментар куратора — найважливіше на сторінці, коли він є. */}
      {submission?.feedback && (
        <div className={`mt-5 rounded-2xl p-4 ${status === "rework" ? "bg-pink-deep/10" : "bg-lime/25"}`}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
            коментар куратора
          </p>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">
            {submission.feedback}
          </p>
        </div>
      )}

      {/* ── текст ── */}
      <label className="mt-6 block">
        <span className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
          твоя відповідь
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={locked}
          rows={5}
          maxLength={4000}
          placeholder="Опиши, як виконувала аплікацію: на кому, який натяг, що вийшло і що ні."
          className="mt-2 w-full resize-y rounded-2xl border border-ink/10 bg-cream px-4 py-3.5 text-base outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-lime/40 disabled:opacity-60 sm:text-sm"
        />
      </label>

      {/* ── фото ── */}
      <div className="mt-5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
          фото результату
          {assignment.min_photos > 0 && ` — мінімум ${assignment.min_photos}`}
        </span>

        <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.path} className="relative aspect-square overflow-hidden rounded-2xl bg-ink/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              {!locked && (
                <button
                  onClick={() => removePhoto(p.path)}
                  aria-label="Видалити фото"
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur transition active:bg-ink"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                       strokeLinecap="round" className="h-3.5 w-3.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {!locked && photos.length < assignment.max_photos && (
            <button
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-ink/25 text-ink/45 transition active:bg-ink/5 disabled:opacity-50 sm:hover:border-ink/40 sm:hover:text-ink"
            >
              {uploading ? (
                <Spinner className="h-6 w-6" label="Завантажуємо" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                       strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-[11px] font-bold uppercase tracking-widest">фото</span>
                </>
              )}
            </button>
          )}
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          className="hidden"
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!locked && (
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <button
            onClick={() => save(true)}
            disabled={!canSubmit || busy}
            className="flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-lime px-8 text-sm font-bold uppercase tracking-wide text-ink transition active:brightness-90 disabled:opacity-50 sm:hover:brightness-95"
          >
            {saving && <Spinner className="h-5 w-5" />}
            {status && status !== "draft" ? "надіслати оновлену роботу" : "здати роботу"}
          </button>

          <button
            onClick={() => save(false)}
            disabled={busy}
            className="flex min-h-12 items-center justify-center rounded-full px-5 text-xs font-bold uppercase tracking-widest text-ink/50 transition active:text-ink disabled:opacity-50 sm:hover:text-ink"
          >
            зберегти чернетку
          </button>
        </div>
      )}

      {locked && (
        <p className="mt-6 text-sm font-semibold text-ink/55">
          Роботу прийнято — редагувати вже не потрібно.
        </p>
      )}
    </section>
  );
}
