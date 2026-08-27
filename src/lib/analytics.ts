// ─────────────────────────────────────────────────────────────
//  Трекінг подій (ТЗ, розділ EVENTS).
//  Обгортка над GA4 / Meta Pixel: якщо їх не підключено,
//  виклики просто нічого не роблять — жодних помилок у консолі.
// ─────────────────────────────────────────────────────────────

export type EventName =
  | "page_view"
  | "hero_cta_click"
  | "program_open"
  | "faq_open"
  | "offer_view"
  | "price_view"
  | "telegram_click"
  // Воронка продажу: клік по CTA → відкрита модалка → перехід у monobank.
  | "checkout_cta_click"
  | "checkout_open"
  | "checkout_start"
  | "purchase"
  // Онбординг у кабінеті: квіз тепер проходять уже після оплати.
  | "onboarding_quiz_complete"
  // Домашні роботи.
  | "homework_submit";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(name: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // UTM-мітки чіпляємо до кожної події, щоб бачити джерело трафіку.
  const utm = getUtm();
  const payload = { ...utm, ...params };

  try {
    window.gtag?.("event", name, payload);
    window.dataLayer?.push({ event: name, ...payload });
    window.fbq?.("trackCustom", name, payload);
  } catch {
    // аналітика ніколи не має ламати сторінку
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** Читає UTM з URL і запамʼятовує на сесію — щоб мітки не губились. */
export function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) fromUrl[k] = v;
    }
    if (Object.keys(fromUrl).length) {
      sessionStorage.setItem("utm", JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem("utm");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
