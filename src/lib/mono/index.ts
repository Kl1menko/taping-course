import crypto from "node:crypto";

const API = "https://api.monobank.ua/api/merchant";

export type InvoiceStatus =
  | "created"
  | "processing"
  | "hold"
  | "success"
  | "failure"
  | "reversed"
  | "expired";

export type WebhookPayload = {
  invoiceId: string;
  status: InvoiceStatus;
  amount: number;
  ccy: number;
  reference?: string;
  failureReason?: string;
  modifiedDate?: string;
};

function token() {
  const t = process.env.MONOBANK_TOKEN;
  if (!t) throw new Error("MONOBANK_TOKEN is not set");
  return t;
}

/** Створює рахунок і повертає посилання на сторінку оплати. */
export async function createInvoice(params: {
  amount: number; // у копійках
  reference: string;
  destination: string;
  redirectUrl: string;
  webHookUrl: string;
  ccy?: number;
}): Promise<{ invoiceId: string; pageUrl: string }> {
  const res = await fetch(`${API}/invoice/create`, {
    method: "POST",
    headers: {
      "X-Token": token(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      ccy: params.ccy ?? 980,
      merchantPaymInfo: {
        reference: params.reference,
        destination: params.destination,
      },
      redirectUrl: params.redirectUrl,
      webHookUrl: params.webHookUrl,
      paymentType: "debit",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`monobank invoice/create ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** Статус рахунку — підстраховка, якщо вебхук не дійшов. */
export async function getInvoiceStatus(invoiceId: string): Promise<WebhookPayload> {
  const res = await fetch(`${API}/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`, {
    headers: { "X-Token": token() },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`monobank invoice/status ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

let pubKeyCache: { key: string; at: number } | null = null;

async function getPublicKey(): Promise<string> {
  // Ключ змінюється рідко — кешуємо на годину.
  if (pubKeyCache && Date.now() - pubKeyCache.at < 3_600_000) return pubKeyCache.key;

  const res = await fetch(`${API}/pubkey`, {
    headers: { "X-Token": token() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`monobank pubkey ${res.status}`);

  const { key } = (await res.json()) as { key: string };
  pubKeyCache = { key, at: Date.now() };
  return key;
}

/**
 * Перевіряє підпис вебхука (ECDSA-SHA256 над сирим тілом запиту).
 * rawBody має бути точною строкою тіла — не перезібраним JSON.
 */
export async function verifyWebhook(rawBody: string, xSign: string | null): Promise<boolean> {
  if (!xSign) return false;
  try {
    const keyBase64 = await getPublicKey();
    const publicKey = crypto.createPublicKey({
      key: Buffer.from(keyBase64, "base64"),
      format: "pem",
    });
    return crypto
      .createVerify("SHA256")
      .update(rawBody)
      .verify(publicKey, Buffer.from(xSign, "base64"));
  } catch {
    return false;
  }
}
