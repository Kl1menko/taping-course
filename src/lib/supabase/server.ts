// Падає на збірці, якщо цей модуль потрапить у клієнтський бандл.
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Клієнт для Server Components / Route Handlers.
// У Next 15 cookies() асинхронна — звідси await.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component не може писати куки — оновленням
            // сесії займається middleware.
          }
        },
      },
    }
  );
}

// Клієнт із service-role ключем: обходить RLS.
// Тільки для серверної логіки (вебхук оплати, видача доступу).
// НІКОЛИ не імпортувати в клієнтський код.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
