import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Знаходить або створює користувача за email.
 * Вебхук і /thanks можуть спрацювати одночасно, тому створення
 * має бути стійким до гонки: якщо createUser упав через дубль —
 * дістаємо наявного з profiles (його створює тригер).
 */
export async function resolveUser(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();
  if (existing?.id) return existing.id;

  const { data: created } = await admin.auth.admin.createUser({
    email: normalized,
    email_confirm: true,
  });
  if (created?.user) return created.user.id;

  // Не створився — майже напевно паралельний виклик щойно його створив.
  const { data: retry } = await admin
    .from("profiles")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();
  return retry?.id ?? null;
}

/**
 * Відкриває доступ за оплаченим рахунком.
 * Ідемпотентна: повторний виклик не створює другий enrollment.
 */
export async function grantAccess(order: {
  id: string;
  email: string;
  user_id: string | null;
}): Promise<{ userId: string } | null> {
  const admin = createAdminClient();

  const userId = order.user_id ?? (await resolveUser(order.email));
  if (!userId) {
    console.error("[grant] не вдалося визначити користувача для", order.email);
    return null;
  }

  await admin.from("orders").update({
    user_id: userId,
    updated_at: new Date().toISOString(),
  }).eq("id", order.id);

  await admin.from("enrollments").upsert(
    { user_id: userId, order_id: order.id, source: "purchase" },
    { onConflict: "user_id" }
  );

  return { userId };
}
