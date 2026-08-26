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

  const { data: link } = await admin
    .from("telegram_links")
    .select("token, email, used_at, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!link || link.used_at || new Date(link.expires_at) < new Date() || !link.email) {
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  await admin
    .from("telegram_links")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token);

  const ok = await signInAs(link.email);
  return NextResponse.redirect(`${origin}${ok ? "/cabinet" : "/login?error=failed"}`);
}
