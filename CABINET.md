# Кабінет курсу — налаштування

## 1. Supabase

1. Створити проєкт на [supabase.com](https://supabase.com).
2. SQL Editor → виконати по черзі:
   - `supabase/migrations/0001_init.sql` (таблиці, RLS, тригери)
   - `supabase/migrations/0002_seed.sql` (6 модулів, 24 уроки)
3. Authentication → Providers → **Email**: увімкнути,
   вимкнути «Confirm email» не треба — вхід іде через magic link.
4. Authentication → URL Configuration → Redirect URLs додати:
   - `http://localhost:3000/auth/callback`
   - `https://ТВІЙ-ДОМЕН/auth/callback`
5. Project Settings → API — скопіювати `URL`, `anon key`, `service_role key`.

## 2. monobank

1. [web.monobank.ua](https://web.monobank.ua) → Розробникам → отримати `X-Token`
   для еквайрингу.
2. Вебхук налаштовувати не треба — URL передається при створенні рахунку.
3. **Вебхук працює лише на публічному домені.** Локально — через
   `ngrok http 3000` і `NEXT_PUBLIC_SITE_URL=https://xxx.ngrok.io`.

## 3. Змінні оточення

Скопіювати `.env.example` → `.env.local` і заповнити.
На Vercel ті самі змінні додати в Project Settings → Environment Variables.

## 4. Відео

Уроки створюються сідом без відео (`video_id = null`) — сторінка показує
заглушку «Відео ще завантажується».

Щоб підключити урок: залити відео на YouTube як **Unlisted**, узяти ID
з посилання (`youtu.be/‹ID›`) і записати в БД:

```sql
update public.lessons set video_id = 'ВАШ_ID'
where slug = 'module-01-l1';
```

### Про захист відео

Unlisted-відео захищене лише незнанням посилання: ID видно в DOM плеєра,
його можна переслати будь-кому. Для курсу за $499 це реальний ризик.

Провайдер винесено в поле `lessons.video_provider` і окремий `case`
у `VideoPlayer` — перехід на Bunny Stream (підписані URL, ~$5–10/міс)
зачепить лише ці два місця.

## 5. Як це працює

```
Оплата:  Pricing → BuyButton → /api/checkout → monobank invoice
                                     ↓
         сторінка оплати monobank → /api/mono/webhook (перевірка підпису)
                                     ↓
         створення user + enrollments → доступ відкрито

Вхід:    /login → magic link на пошту → /auth/callback → /cabinet
```

Доступ перевіряється у двох місцях:
- **middleware** — редіректить неавторизованих з `/cabinet` на `/login`;
- **RLS у БД** — навіть із валідним токеном закриті уроки не віддаються.

## 6. Адмін

Щоб зробити користувача адміном:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

Видати доступ вручну (без оплати):

```sql
insert into public.enrollments (user_id, source)
select id, 'manual' from auth.users where email = 'student@example.com';
```
