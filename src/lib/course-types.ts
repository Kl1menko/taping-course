// Типи й чисті функції курсу — без серверних імпортів,
// щоб клієнтські компоненти могли їх використовувати.
// Всі запити до Supabase живуть у @/lib/course.

export type Assignment = {
  id: string;
  lesson_id: string;
  title: string;
  brief: string;
  min_photos: number;
  max_photos: number;
  is_required: boolean;
};

export type SubmissionStatus = "draft" | "submitted" | "accepted" | "rework";

export type Submission = {
  id: string;
  assignment_id: string;
  lesson_id: string;
  text: string;
  photos: string[];
  status: SubmissionStatus;
  feedback: string | null;
  submitted_at: string | null;
  updated_at: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  video_provider: string;
  video_id: string | null;
  duration_sec: number | null;
  is_preview: boolean;
  position: number;
  assignments: Assignment[];
};

export type ModuleWithLessons = {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string | null;
  icon: string | null;
  position: number;
  lessons: Lesson[];
};

/** Здача рахується зданою, щойно її надіслали: доопрацювання не відкочує урок. */
export function isSubmitted(s: Submission | undefined): boolean {
  return !!s && s.status !== "draft";
}

/** Плаский список уроків у порядку проходження. */
export function flatten(modules: ModuleWithLessons[]) {
  return modules.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })));
}

/**
 * Урок вважається закритим, поки не здано обовʼязкове ДЗ попереднього.
 *
 * Гейт м'який навмисно: чекаємо факт здачі, а не вердикт куратора —
 * інакше навчання зупиняється щоразу, коли перевірка затримується.
 */
export function isLessonLocked(
  flat: { lesson: Lesson }[],
  index: number,
  submissions: Record<string, Submission>
): boolean {
  for (let i = 0; i < index; i++) {
    const lesson = flat[i].lesson;
    const assignment = lesson.assignments?.[0];
    if (!assignment?.is_required) continue;
    if (!isSubmitted(submissions[lesson.id])) return true;
  }
  return false;
}
