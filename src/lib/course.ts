import { createClient } from "@/lib/supabase/server";

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

/** Чи має поточний користувач активний доступ до курсу. */
export async function hasAccess(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("enrollments")
    .select("expires_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return false;
  return !data.expires_at || new Date(data.expires_at) > new Date();
}

/** Модулі з уроками. RLS сама відсіє закриті уроки без доступу. */
export async function getCourse(): Promise<ModuleWithLessons[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .order("position")
    .order("position", { foreignTable: "lessons" });

  if (error) {
    console.error("[course] fetch failed", error);
    return [];
  }
  return (data ?? []) as ModuleWithLessons[];
}

/** Мапа lesson_id → завершено. */
export async function getProgress(): Promise<Record<string, boolean>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  return Object.fromEntries((data ?? []).map((r) => [r.lesson_id, r.completed]));
}
