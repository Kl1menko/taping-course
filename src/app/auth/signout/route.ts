import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Кнопка «вийти» в шапці веде на головну, а «увійти іншою поштою»
  // з екрана без доступу — одразу на форму входу.
  const form = await request.formData().catch(() => null);
  const to = form?.get("next") === "/login" ? "/login" : "/";

  return NextResponse.redirect(new URL(to, request.url), { status: 303 });
}
