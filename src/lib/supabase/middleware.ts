import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Оновлює сесію на кожному запиті й закриває /cabinet від неавторизованих.
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;

  // Middleware обробляє ВЕСЬ сайт, тому будь-яка помилка тут кладе
  // і лендинг. Продажі важливіші за кабінет: без ключів або при збої
  // Supabase пропускаємо публічні сторінки, закриваючи лише /cabinet.
  if (!url || !anonKey) {
    console.error("[middleware] немає змінних Supabase");
    return guestFallback(request, pathname);
  }

  try {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // ВАЖЛИВО: getUser() валідує токен на сервері Supabase.
    // getSession() довіряти не можна — його вміст читається з куки.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && pathname.startsWith("/cabinet")) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/login";
      redirect.searchParams.set("next", pathname);
      return NextResponse.redirect(redirect);
    }

    return response;
  } catch (e) {
    console.error("[middleware] збій сесії", e);
    return guestFallback(request, pathname);
  }
}

/** Сесію перевірити не вдалося: лендинг працює, кабінет — під логіном. */
function guestFallback(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/cabinet")) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }
  return NextResponse.next({ request });
}
