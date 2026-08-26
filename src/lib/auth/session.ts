import "server-only";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * Створює справжню сесію для email без жодного листа.
 *
 * generateLink() віддає одноразовий OTP, який ми тут же гасимо
 * через verifyOtp() — лист нікуди не йде, а куки ставляться так
 * само, як після переходу за magic link. Це і є вхід без пошти,
 * потрібний, поки немає домену для Resend.
 *
 * Викликати ЛИШЕ після того, як право на доступ уже доведено
 * (оплата підтверджена monobank, вірний код, підтверджений Telegram).
 * Сама по собі функція нічого не перевіряє.
 */
export async function signInAs(email: string): Promise<boolean> {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();

  // Користувач на цей момент уже існує: його створює resolveUser()
  // у grantAccess() перед видачею доступу. Тому досить magiclink —
  // signup тут дав би помилку «user already registered».
  const { data, error: genErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: normalized,
  });
  const hashed = data?.properties?.hashed_token;
  if (genErr || !hashed) {
    console.error("[auth] не вдалося згенерувати токен для", normalized, genErr);
    return false;
  }

  // verifyOtp на серверному клієнті сам покладе куки сесії.
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: hashed,
  });
  if (error) {
    console.error("[auth] verifyOtp не пройшов", error);
    return false;
  }
  return true;
}

/** Токен для t.me/bot?start=… — Telegram дозволяє лише [A-Za-z0-9_-]. */
export function generateLinkToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Buffer.from(bytes).toString("base64url");
}
