import "server-only";

// Курс НБУ USD→UAH. Потрібен, бо ціна курсу вказана в доларах,
// а monobank виставляє рахунки лише в гривні (ccy 980).

const NBU_URL =
  "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json";

// Резервний курс на випадок, коли API НБУ недоступне. Тримаємо його
// свідомо трохи вищим за ринковий — краще виставити рахунок дорожче
// на кілька відсотків, ніж продати курс за пів ціни через збій.
const FALLBACK_RATE = 46;

// Курс змінюється раз на добу — тримаємо в пам'яті шість годин.
const TTL_MS = 6 * 60 * 60 * 1000;

let cache: { rate: number; at: number } | null = null;

/** Курс НБУ USD→UAH. Ніколи не кидає — при збої віддає резервний. */
export async function getUsdRate(): Promise<number> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.rate;

  try {
    const res = await fetch(NBU_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`NBU ${res.status}`);

    const json = (await res.json()) as Array<{ rate?: number }>;
    const rate = json?.[0]?.rate;

    // Санітарна перевірка: захищає від зміни формату відповіді
    // чи сміття замість числа.
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      throw new Error(`NBU: некоректний курс ${JSON.stringify(rate)}`);
    }

    cache = { rate, at: Date.now() };
    return rate;
  } catch (e) {
    console.error("[fx] курс НБУ недоступний, беремо резервний", e);
    // Прострочений кеш кращий за резервну константу.
    if (cache) return cache.rate;
    return FALLBACK_RATE;
  }
}

/** Ціну в доларах → копійки гривні для monobank. */
export async function usdToKopiyky(usd: number): Promise<number> {
  const rate = await getUsdRate();
  return Math.round(usd * rate * 100);
}
