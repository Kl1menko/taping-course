import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getInvoiceStatus } from "@/lib/mono";
import type { ModuleWithLessons, Submission } from "@/lib/course-types";

// Типи й чисті хелпери переїхали в course-types.ts, щоб їх могли
// імпортувати клієнтські компоненти. Реекспорт — щоб не правити імпорти.
export * from "@/lib/course-types";

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

  if (data) {
    return !data.expires_at || new Date(data.expires_at) > new Date();
  }

  // Доступу немає. Можливо, вебхук не дійшов — питаємо monobank напряму
  // про незакриті рахунки на цю пошту й відкриваємо доступ, якщо оплачено.
  return await reconcileAccess(user.id, user.email);
}

/**
 * Підстраховка на випадок втраченого вебхука: перевіряє статус рахунків
 * користувача в monobank і, якщо оплата пройшла, видає enrollment.
 * Повертає true, якщо доступ відкрито.
 */
async function reconcileAccess(userId: string, email?: string): Promise<boolean> {
  if (!email) return false;

  try {
    const admin = createAdminClient();

    // Рахунки на цю пошту, які ще не позначені успішними.
    const { data: orders } = await admin
      .from("orders")
      .select("id, invoice_id, amount, status")
      .eq("email", email.toLowerCase())
      .not("invoice_id", "is", null)
      .neq("status", "success")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!orders?.length) return false;

    for (const order of orders) {
      const invoice = await getInvoiceStatus(order.invoice_id!);
      // Сума має збігатися — той самий захист, що й у вебхуку.
      if (invoice.status !== "success" || invoice.amount !== order.amount) continue;

      await admin
        .from("orders")
        .update({
          status: "success",
          user_id: userId,
          raw: invoice,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      await admin.from("enrollments").upsert(
        { user_id: userId, order_id: order.id, source: "purchase" },
        { onConflict: "user_id" }
      );
      return true;
    }
  } catch (e) {
    console.error("[course] reconcile failed", e);
  }
  return false;
}

/** Модулі з уроками. RLS сама відсіє закриті уроки без доступу. */
export async function getCourse(): Promise<ModuleWithLessons[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*, lessons(*, assignments(*))")
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

/** Мапа lesson_id → здача поточного користувача. */
export async function getSubmissions(): Promise<Record<string, Submission>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("submissions")
    .select("id, assignment_id, lesson_id, text, photos, status, feedback, submitted_at, updated_at")
    .eq("user_id", user.id);

  return Object.fromEntries(
    (data ?? []).map((s) => [s.lesson_id, s as Submission])
  );
}

/**
 * Підписані посилання на фото здачі — бакет приватний, прямі URL не працюють.
 * Повертаємо пари path→url, а не масив URL: якщо якийсь файл підписати
 * не вдалося, за індексами фото зʼїхали б відносно submission.photos.
 */
export async function signPhotos(
  paths: string[]
): Promise<{ path: string; url: string }[]> {
  if (!paths.length) return [];
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("homework")
    .createSignedUrls(paths, 60 * 60);

  return (data ?? []).flatMap((d) =>
    d.path && d.signedUrl ? [{ path: d.path, url: d.signedUrl }] : []
  );
}

/** Відповіді онбординг-квізу. null — квіз ще не пройдено. */
export async function getQuizAnswers(): Promise<Record<string, string> | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("quiz_answers, quiz_completed_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!data?.quiz_completed_at) return null;
  return (data.quiz_answers ?? {}) as Record<string, string>;
}
