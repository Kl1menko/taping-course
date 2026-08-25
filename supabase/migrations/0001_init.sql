-- ─────────────────────────────────────────────────────────────
--  Kotova Taping Course — схема кабінету
--  Виконати в Supabase SQL Editor (або через supabase db push).
-- ─────────────────────────────────────────────────────────────

-- ─── Профілі (розширення auth.users) ─────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── Модулі курсу ────────────────────────────────────────────
create table if not exists public.modules (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  number      text not null,              -- "01".."06"
  title       text not null,
  description text,
  icon        text,                       -- ключ з MEDICAL_ICONS
  position    int  not null,
  created_at  timestamptz not null default now()
);

-- ─── Уроки ───────────────────────────────────────────────────
create table if not exists public.lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references public.modules(id) on delete cascade,
  slug          text not null,
  title         text not null,
  description   text,
  -- Провайдер відео тримаємо окремо від id, щобміграція з YouTube
  -- на Bunny/Vimeo була заміною одного поля, а не переписуванням схеми.
  video_provider text not null default 'youtube',
  video_id       text,                    -- напр. YouTube ID
  duration_sec   int,
  is_preview     boolean not null default false,  -- безкоштовний урок
  position       int not null,
  created_at     timestamptz not null default now(),
  unique (module_id, slug)
);

-- ─── Замовлення / оплати (monobank) ──────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  email           text not null,
  full_name       text,
  phone           text,
  amount          int  not null,          -- у копійках
  ccy             int  not null default 980,
  status          text not null default 'created',
    -- created | processing | success | failure | reversed | expired
  invoice_id      text unique,            -- monobank invoiceId
  reference       text unique not null,   -- наш внутрішній референс
  paid_at         timestamptz,
  raw             jsonb,                  -- останній payload вебхука
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists orders_email_idx  on public.orders(email);
create index if not exists orders_status_idx on public.orders(status);

-- ─── Доступ до курсу ─────────────────────────────────────────
create table if not exists public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete set null,
  source      text not null default 'purchase',  -- purchase | manual | gift
  expires_at  timestamptz,                -- null = безстроково
  created_at  timestamptz not null default now(),
  unique (user_id)
);

-- ─── Прогрес ─────────────────────────────────────────────────
create table if not exists public.lesson_progress (
  user_id       uuid not null references auth.users(id) on delete cascade,
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  completed     boolean not null default false,
  position_sec  int not null default 0,   -- де зупинився
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ─────────────────────────────────────────────────────────────
--  RLS
-- ─────────────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.modules         enable row level security;
alter table public.lessons         enable row level security;
alter table public.orders          enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;

-- Чи має користувач активний доступ
create or replace function public.has_course_access(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.enrollments e
    where e.user_id = uid
      and (e.expires_at is null or e.expires_at > now())
  );
$$;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = uid), false);
$$;

-- profiles: кожен бачить і редагує лише себе
drop policy if exists "profiles read own"   on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles read own"   on public.profiles for select using (auth.uid() = id or public.is_admin(auth.uid()));
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

-- modules: заголовки модулів видно всім (потрібно для програми на лендінгу)
drop policy if exists "modules read all" on public.modules;
create policy "modules read all" on public.modules for select using (true);

-- lessons: превʼю — всім; решта — лише тим, хто має доступ
drop policy if exists "lessons read" on public.lessons;
create policy "lessons read" on public.lessons for select
  using (is_preview or public.has_course_access(auth.uid()));

-- orders: користувач бачить лише свої (запис — тільки сервером)
drop policy if exists "orders read own" on public.orders;
create policy "orders read own" on public.orders for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- enrollments: лише свої (видає сервер після оплати)
drop policy if exists "enrollments read own" on public.enrollments;
create policy "enrollments read own" on public.enrollments for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- lesson_progress: повний доступ до власного прогресу
drop policy if exists "progress rw own" on public.lesson_progress;
create policy "progress rw own" on public.lesson_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Автостворення профілю при реєстрації ────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
