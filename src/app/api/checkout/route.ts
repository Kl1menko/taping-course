import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/mono";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { pricing } from "@/content";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }

  // Ціну беремо з сервера, а не з тіла запиту — інакше її можна підмінити.
  const amount = pricing.plan.price * 100;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const reference = crypto.randomUUID();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const admin = createAdminClient();
  const { error: insErr } = await admin.from("orders").insert({
    user_id: user?.id ?? null,
    email,
    full_name: name || null,
    phone: phone || null,
    amount,
    reference,
    status: "created",
  });
  if (insErr) {
    console.error("[checkout] order insert failed", insErr);
    return NextResponse.json({ error: "could not create order" }, { status: 500 });
  }

  try {
    const invoice = await createInvoice({
      amount,
      reference,
      destination: pricing.plan.name,
      redirectUrl: `${origin}/cabinet?paid=1`,
      webHookUrl: `${origin}/api/mono/webhook`,
    });

    await admin
      .from("orders")
      .update({ invoice_id: invoice.invoiceId, updated_at: new Date().toISOString() })
      .eq("reference", reference);

    return NextResponse.json({ url: invoice.pageUrl });
  } catch (e) {
    console.error("[checkout] monobank failed", e);
    await admin.from("orders").update({ status: "failure" }).eq("reference", reference);
    return NextResponse.json({ error: "payment provider error" }, { status: 502 });
  }
}
