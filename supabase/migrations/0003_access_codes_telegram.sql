-- ─────────────────────────────────────────────────────────────
--  Вхід без пошти: код доступу + Telegram
--  Потрібно, поки немає власного домену — Resend не верифікує
--  *.vercel.app, тому magic link нікому, крім власника акаунта
--  Resend, не доходить. Ці два канали від пошти не залежать.
-- ─────────────────────────────────────────────────────────────

-- ─── Код доступу до кабінету ─────────────────────────────────
-- Другий ключ на випадок «оплатив з телефона, дивлюсь з ноутбука».
-- Живе в orders, бо прив'язаний саме до оплати.
alter table public.orders
  add column if not exists access_code text,
  -- Скільки разів код вводили невірно. Захист від перебору:
  -- 6 цифр — це мільйон варіантів, без ліміту вони підбираються.
  add column if not exists code_attempts int not null default 0,
  -- Сесію одразу після оплати віддаємо рівно один раз: redirectUrl
  -- лишається в історії браузера і може бути переслано.
  add column if not exists auto_login_used_at timestamptz;

create index if not exists orders_access_code_idx
  on public.orders(access_code) where access_code is not null;

-- ─── Telegram ────────────────────────────────────────────────
-- Прив'язка акаунта до Telegram. Номер телефону приходить із
-- request_contact — верифікований, без SMS і без Twilio.
alter table public.profiles
  add column if not exists telegram_id   bigint unique,
  add column if not exists telegram_user text,
  add column if not exists phone_verified boolean not null default false;

create index if not exists profiles_phone_idx
  on public.profiles(phone) where phone is not null;

-- Одноразові токени для deep link t.me/bot?start=<token>.
-- Окрема таблиця, а не поле в orders: токен живе хвилини,
-- а orders — назавжди, і змішувати їх строки життя не варто.
create table if not exists public.telegram_links (
  token       text primary key,
  order_id    uuid references public.orders(id) on delete cascade,
  user_id     uuid references auth.users(id)   on delete cascade,
  email       text,
  used_at     timestamptz,
  expires_at  timestamptz not null default now() + interval '24 hours',
  created_at  timestamptz not null default now()
);

alter table public.telegram_links enable row level security;
-- Політик навмисно немає: таблиця лише для service-role
-- (бот і роут прив'язки). RLS без політик = доступ закрито всім.
