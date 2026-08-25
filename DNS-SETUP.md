# Що потрібно від власника домену `kotovataping.com`

Домен зареєстровано через **HostPro** (15.06.2026). Зараз DNS порожній —
жодних записів немає, тому домен нікуди не веде і пошта з нього не йде.

Щоб запустити курс, потрібні дві речі: **пошта** (щоб учні отримували
доступ після оплати) і **сайт** (щоб працював на своєму домені,
а не на `taping-course-ten.vercel.app`).

---

## Варіант А — дати доступ до DNS (найпростіше)

Попросити доступ до панелі HostPro (або до розділу «DNS-записи» домену).
Тоді все налаштовується самостійно за 15 хвилин.

---

## Варіант Б — попросити додати записи

Якщо доступ дати не можуть — надіслати їм список нижче.
Записи додаються в панелі управління доменом, розділ **DNS / DNS-записи**.

### 1. Для пошти (Resend)

> ⚠️ Точні значення видасть Resend після додавання домену:
> resend.com → **Domains** → **Add Domain** → `kotovataping.com`.
> Нижче — формат, який буде. **Скопіювати треба саме ті значення,
> що покаже Resend** — DKIM-ключ унікальний для кожного акаунта.

| Тип | Ім'я (Name) | Значення (Value) |
|---|---|---|
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey` | *(довгий DKIM-ключ від Resend)* |
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (пріоритет 10) |

Після додавання — у Resend натиснути **Verify**. Перевірка займає
від кількох хвилин до кількох годин.

### 2. Для сайту (Vercel)

| Тип | Ім'я (Name) | Значення (Value) |
|---|---|---|
| CNAME | `www` | `cname.vercel-dns.com` |
| A | `@` | *(IP покаже Vercel — він змінюється)* |

> **Точні значення бере з Vercel**: Project → Settings → Domains →
> додати `kotovataping.com`. Vercel одразу покаже, які записи створити.
> IP-адресу для `@` не вписувати з пам'яті — брати лише ту, що показує Vercel.

---

## Після того, як записи додані

1. **Resend** → Domains → дочекатись статусу **Verified**.
2. **Supabase** → Authentication → Emails → SMTP Settings →
   поле **Sender email address** змінити на:
   ```
   noreply@kotovataping.com
   ```
3. **Vercel** → Settings → Environment Variables →
   `NEXT_PUBLIC_SITE_URL` = `https://kotovataping.com`
4. **Supabase** → Authentication → URL Configuration → Redirect URLs
   додати: `https://kotovataping.com/auth/callback`

---

## Як перевірити, що спрацювало

```bash
# мають з'явитися записи (зараз порожньо)
dig +short kotovataping.com A
dig +short send.kotovataping.com TXT
dig +short resend._domainkey.kotovataping.com TXT
```

Після цього лист про доступ приходитиме **будь-якому** покупцеві,
а не лише власнику акаунта Resend.

---

## Чому це блокує запуск

Зараз відправник — `onboarding@resend.dev`, тестова адреса Resend.
Вона шле листи **тільки на пошту власника акаунта Resend**.

Це означає: людина оплачує курс 499 $, вебхук відкриває доступ у базі,
але лист із посиланням на вхід **не доходить**. Клієнт лишається
без доступу і без пояснень.

Обійти без власного домену не вийде — Resend не дозволяє підтверджувати
спільні домени на кшталт `*.vercel.app`.
