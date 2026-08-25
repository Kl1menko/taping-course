-- ─────────────────────────────────────────────────────────────
--  Сід: модулі та уроки з src/content.ts
--  video_id лишається null — заповнюється в адмінці після
--  завантаження відео на YouTube.
-- ─────────────────────────────────────────────────────────────

insert into public.modules (slug, number, title, icon, position) values
  ('module-01', '01', $$Основи та матеріали$$, 'bandage', 1),
  ('module-02', '02', $$Анатомія під тейп$$, 'muscle', 2),
  ('module-03', '03', $$Базові техніки$$, 'dna', 3),
  ('module-04', '04', $$Спина, шия, постава$$, 'shoulderNeck', 4),
  ('module-05', '05', $$Кінцівки та спорт$$, 'knee', 5),
  ('module-06', '06', $$Лімфодренаж і практика$$, 'heartRate', 6)
on conflict (slug) do update
  set title = excluded.title, icon = excluded.icon, position = excluded.position;

insert into public.lessons (module_id, slug, title, position, is_preview)
select m.id, v.slug, v.title, v.position, v.is_preview
from (values
  ('module-01', 'module-01-l1', $$Як влаштований кінезіотейп і чому він тягнеться саме так$$, 1, true),
  ('module-01', 'module-01-l2', $$Види тейпів: бавовна, синтетика, посилені$$, 2, false),
  ('module-01', 'module-01-l3', $$Підготовка шкіри, зняття, догляд після аплікації$$, 3, false),
  ('module-01', 'module-01-l4', $$Протипоказання і коли тейп не використовують$$, 4, false),
  ('module-02', 'module-02-l1', $$Поверхнева анатомія: як знайти м'яз руками$$, 1, false),
  ('module-02', 'module-02-l2', $$Напрямок волокон і логіка натягу$$, 2, false),
  ('module-02', 'module-02-l3', $$Фасції та їх роль у роботі з тейпом$$, 3, false),
  ('module-02', 'module-02-l4', $$Практика пальпації основних груп$$, 4, false),
  ('module-03', 'module-03-l1', $$М'язова техніка: тонізація та розслаблення$$, 1, false),
  ('module-03', 'module-03-l2', $$Зв'язкова і сухожилкова аплікації$$, 2, false),
  ('module-03', 'module-03-l3', $$Корекційні техніки: механічна, фасціальна$$, 3, false),
  ('module-03', 'module-03-l4', $$Форми: I, Y, X, віяло, кошик$$, 4, false),
  ('module-04', 'module-04-l1', $$Поперек: схеми при статичних навантаженнях$$, 1, false),
  ('module-04', 'module-04-l2', $$Грудний відділ і робота з сутулістю$$, 2, false),
  ('module-04', 'module-04-l3', $$Шийний відділ: обережні техніки$$, 3, false),
  ('module-04', 'module-04-l4', $$Комбіновані схеми на всю спину$$, 4, false),
  ('module-05', 'module-05-l1', $$Плече, лікоть, зап'ясток$$, 1, false),
  ('module-05', 'module-05-l2', $$Коліно: різні схеми під різні задачі$$, 2, false),
  ('module-05', 'module-05-l3', $$Гомілка і стопа, робота зі склепінням$$, 3, false),
  ('module-05', 'module-05-l4', $$Аплікації до і після навантаження$$, 4, false),
  ('module-06', 'module-06-l1', $$Віяльні техніки та принцип роботи$$, 1, false),
  ('module-06', 'module-06-l2', $$Робота з набряками після навантажень$$, 2, false),
  ('module-06', 'module-06-l3', $$Розбір реальних кейсів учнів$$, 3, false),
  ('module-06', 'module-06-l4', $$Залік: 5 аплікацій під наглядом викладача$$, 4, false)
) as v(module_slug, slug, title, position, is_preview)
join public.modules m on m.slug = v.module_slug
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position;
