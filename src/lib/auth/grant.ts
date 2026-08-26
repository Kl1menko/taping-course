import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { generateAccessCode } from "./session";

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
 * Відкриває доступ за оплаченим рахунком і повертає код доступу.
 * Ідемпотентна: повторний виклик не створює другий enrollment
 * і не перевипускає код — людина могла його вже записати.
 */
export async function grantAccess(order: {
  id: string;
  email: string;
  user_id: string | null;
  access_code?: string | null;
}): Promise<{ userId: string; code: string } | null> {
  const admin = createAdminClient();

  const userId = order.user_id ?? (await resolveUser(order.email));
  if (!userId) {
    console.error("[grant] не вдалося визначити користувача для", order.email);
    return null;
  }

  const code = order.access_code ?? generateAccessCode();

  await admin.from("orders").update({
    user_id: userId,
    access_code: code,
    updated_at: new Date().toISOString(),
  }).eq("id", order.id);

  await admin.from("enrollments").upsert(
    { user_id: userId, order_id: order.id, source: "purchase" },
    { onConflict: "user_id" }
  );

  return { userId, code };
}
