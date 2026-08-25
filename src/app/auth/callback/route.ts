import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Обмін коду з листа на сесію.
//
// Supabase шле два різні формати посилань:
//   ?code=…                    — PKCE, коли лист ініціює наш клієнт;
//   ?token_hash=…&type=magiclink — коли лист шле сам Supabase
//                                  (у т.ч. через власний SMTP).
// Підтримуємо обидва, інакше частина листів не відкриває кабінет.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/cabinet";

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=1`);
}
