import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { signInAs } from "@/lib/auth/session";

/**
 * Обмін токена з Telegram на сесію.
 * Токен одноразовий і живе 15 хвилин — переслане посилання марне.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  // Гасимо токен умовним апдейтом, а не парою «прочитати → записати»:
  // два паралельні переходи за одним посиланням інакше обидва пройшли б
  // перевірку до того, як перший встиг записати used_at.
  const { data: link } = await admin
    .from("telegram_links")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("email")
    .maybeSingle();

  if (!link?.email) {
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  const ok = await signInAs(link.email);
  return NextResponse.redirect(`${origin}${ok ? "/cabinet" : "/login?error=failed"}`);
}
