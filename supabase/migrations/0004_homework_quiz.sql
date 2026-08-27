-- ─────────────────────────────────────────────────────────────
--  Домашні роботи під уроками + онбординг-квіз у кабінеті
-- ─────────────────────────────────────────────────────────────

-- ─── Завдання до уроку ───────────────────────────────────────
-- Окрема таблиця, а не поле в lessons: не в кожного уроку є ДЗ,
-- а текст завдання редагується незалежно від самого уроку.
create table if not exists public.assignments (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  title       text not null default 'Домашнє завдання',
  brief       text not null,               -- що зробити
  -- Скільки фото вимагаємо. 0 = достатньо тексту.
  min_photos  int  not null default 1,
  max_photos  int  not null default 5,
  -- Чи блокує здача перехід далі. Для оглядових уроків можна вимкнути.
  is_required boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (lesson_id)
);

-- ─── Здача ───────────────────────────────────────────────────
create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  text          text not null default '',
  -- Шляхи у приватному бакеті homework, не публічні URL:
  -- посилання підписуються при кожному показі.
  photos        text[] not null default '{}',
  status        text not null default 'draft',
    -- draft | submitted | accepted | rework
  feedback      text,                      -- коментар куратора
  reviewed_by   uuid references auth.users(id) on delete set null,
  reviewed_at   timestamptz,
  submitted_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, assignment_id)
);

create index if not exists submissions_status_idx on public.submissions(status);
create index if not exists submissions_lesson_idx on public.submissions(lesson_id);

-- ─── Відповіді онбординг-квізу ───────────────────────────────
-- Квіз переїхав з лендінгу в кабінет: до першого уроку питаємо
-- роль, досвід і мету — і показуємо це кураторові поруч із ДЗ.
alter table public.profiles
  add column if not exists quiz_answers    jsonb,
  add column if not exists quiz_completed_at timestamptz;

-- ─────────────────────────────────────────────────────────────
--  RLS
-- ─────────────────────────────────────────────────────────────
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;

-- assignments: видно тим, хто має доступ, або якщо урок — безкоштовне превʼю
drop policy if exists "assignments read" on public.assignments;
create policy "assignments read" on public.assignments for select
  using (
    public.has_course_access(auth.uid())
    or exists (
      select 1 from public.lessons l
      where l.id = assignments.lesson_id and l.is_preview
    )
  );

-- submissions: студент повністю керує своєю здачею, поки вона не прийнята
drop policy if exists "submissions read own"   on public.submissions;
drop policy if exists "submissions insert own" on public.submissions;
drop policy if exists "submissions update own" on public.submissions;
create policy "submissions read own" on public.submissions for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy "submissions insert own" on public.submissions for insert
  with check (auth.uid() = user_id and public.has_course_access(auth.uid()));
create policy "submissions update own" on public.submissions for update
  using (auth.uid() = user_id and status in ('draft', 'rework', 'submitted'))
  with check (auth.uid() = user_id);

-- Куратор рецензує через service-role (API-роут), окремої політики не треба.

-- ─────────────────────────────────────────────────────────────
--  Storage: приватний бакет під фото домашніх робіт
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'homework', 'homework', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Шлях завжди <user_id>/<lesson_id>/<file>. Перший сегмент — власник:
-- так політика зводиться до порівняння з auth.uid() без джойнів.
drop policy if exists "homework read own"   on storage.objects;
drop policy if exists "homework write own"  on storage.objects;
drop policy if exists "homework delete own" on storage.objects;

create policy "homework read own" on storage.objects for select
  using (
    bucket_id = 'homework'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin(auth.uid()))
  );

create policy "homework write own" on storage.objects for insert
  with check (
    bucket_id = 'homework'
    and auth.uid()::text = (storage.foldername(name))[1]
    and public.has_course_access(auth.uid())
  );

create policy "homework delete own" on storage.objects for delete
  using (
    bucket_id = 'homework'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─────────────────────────────────────────────────────────────
--  Сід: завдання до кожного уроку
--  Текст — заготовка, редагується в Supabase під конкретне відео.
-- ─────────────────────────────────────────────────────────────
insert into public.assignments (lesson_id, brief, min_photos, is_required)
select
  l.id,
  'Виконай аплікацію з уроку «' || l.title ||
  '» і надішли фото результату. У тексті опиши: на кому працювала, який натяг обрала і чому.',
  1,
  not l.is_preview
from public.lessons l
on conflict (lesson_id) do nothing;

-- updated_at на здачі підтримуємо тригером, а не з клієнта.
create or replace function public.touch_submission()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists submissions_touch on public.submissions;
create trigger submissions_touch
  before update on public.submissions
  for each row execute function public.touch_submission();
