/**
 * POST /functions/v1/process-payment
 *
 * Called from pay.html after the Microform iframe has collected the card
 * (or ACH) details and handed back a transient token. This function:
 *   1. Re-verifies the invoice is still payable.
 *   2. Inserts a 'pending' payment row for audit.
 *   3. Calls BoA's capture API with the token + amount + invoice reference.
 *   4. Updates the payment row with the outcome and, on success, marks
 *      the invoice as paid.
 *   5. Notifies Zac via Resend.
 *
 * Request:  { payment_token, transient_token, method ('card'|'ach'),
 *             billing_name?, billing_email?, billing_zip? }
 * Response: { ok, transaction_id?, message }
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { boaClientFromEnv } from "../_shared/boa-client.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ZAC_EMAIL = "zprizant@lightningledgerz.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ ok: false, message: "Method not allowed" }, 405);

  let body: {
    payment_token?: string;
    transient_token?: string;
    method?: "card" | "ach";
    billing_name?: string;
    billing_email?: string;
    billing_zip?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, message: "Invalid JSON" }, 400);
  }

  const paymentToken = body.payment_token?.trim();
  const transientToken = body.transient_token?.trim();
  const method = body.method === "ach" ? "ach" : "card";
  if (!paymentToken || !transientToken) {
    return json({ ok: false, message: "payment_token and transient_token required" }, 400);
  }

  // 1. Reload invoice, re-check it's payable.
  const { data: invoice, error: invErr } = await supabase
    .from("invoices")
    .select("*")
    .eq("payment_token", paymentToken)
    .maybeSingle();
  if (invErr || !invoice) return json({ ok: false, message: "Invoice not found" }, 404);
  if (invoice.status === "paid") return json({ ok: false, message: "Already paid." }, 410);
  if (invoice.status === "voided") return json({ ok: false, message: "Invoice voided." }, 410);

  // 2. Log a pending payment row for audit (even if capture fails).
  const { data: pending, error: insErr } = await supabase
    .from("payments")
    .insert({
      invoice_id: invoice.id,
      method,
      amount_cents: invoice.amount_cents,
      currency: invoice.currency,
      status: "pending",
      processor: "boa_microform",
    })
    .select()
    .single();
  if (insErr || !pending) {
    console.error("Failed to insert pending payment:", insErr);
    return json({ ok: false, message: "Internal error" }, 500);
  }

  // 3. Capture with BoA.
  let result;
  try {
    const boa = boaClientFromEnv();
    result = await boa.capture({
      transientToken,
      amountCents: invoice.amount_cents,
      currency: invoice.currency,
      reference: invoice.invoice_number,
      billingName: body.billing_name,
      billingEmail: body.billing_email,
      billingZip: body.billing_zip,
      method,
    });
  } catch (e) {
    console.error("BoA capture threw:", e);
    await supabase.from("payments").update({
      status: "failed",
      failed_at: new Date().toISOString(),
      processor_message: String(e),
    }).eq("id", pending.id);
    return json({ ok: false, message: "Payment provider error. No charge made." }, 502);
  }

  // 4. Apply result to the payment + invoice rows.
  const now = new Date().toISOString();
  const paymentUpdate: Record<string, unknown> = {
    processor_transaction_id: result.processorTransactionId,
    processor_response_code: result.responseCode,
    processor_message: result.message,
    processor_payload: result.rawPayload,
    card_brand: result.cardBrand ?? null,
    card_last4: result.cardLast4 ?? null,
  };

  if (result.ok && result.pendingSettlement) {
    // ACH: authorized but not settled — wait for webhook before marking paid.
    paymentUpdate.status = "authorized";
    paymentUpdate.authorized_at = now;
  } else if (result.ok) {
    paymentUpdate.status = "captured";
    paymentUpdate.authorized_at = now;
    paymentUpdate.captured_at = now;
  } else {
    paymentUpdate.status = "failed";
    paymentUpdate.failed_at = now;
  }
  await supabase.from("payments").update(paymentUpdate).eq("id", pending.id);

  if (result.ok && !result.pendingSettlement) {
    // Card: mark invoice paid immediately.
    await supabase.from("invoices").update({
      status: "paid",
      paid_at: now,
    }).eq("id", invoice.id);
  } else if (result.ok && result.pendingSettlement) {
    // ACH: invoice stays 'sent' until webhook arrives. Don't change status.
  } else {
    await supabase.from("invoices").update({ status: "failed" }).eq("id", invoice.id);
  }

  // 5. Notify Zac.
  if (RESEND_KEY) {
    await notifyZac(
      result.ok
        ? (result.pendingSettlement
            ? `💵 ACH authorized — ${invoice.invoice_number} awaiting settlement`
            : `💰 Payment captured — ${invoice.invoice_number}`)
        : `⚠️ Payment failed — ${invoice.invoice_number}`,
      `<p><strong>Invoice:</strong> ${invoice.invoice_number}</p>
       <p><strong>Client:</strong> ${invoice.client_name} (${invoice.client_email})</p>
       <p><strong>Amount:</strong> ${formatMoney(invoice.amount_cents, invoice.currency)}</p>
       <p><strong>Method:</strong> ${method.toUpperCase()}</p>
       <p><strong>Status:</strong> ${result.ok ? (result.pendingSettlement ? "Authorized (awaiting ACH settlement)" : "Captured") : "Failed"}</p>
       <p><strong>Processor response:</strong> ${result.responseCode} — ${result.message}</p>`,
    ).catch((e) => console.error("Zac notify failed:", e));
  }

  return json({
    ok: result.ok,
    transaction_id: result.processorTransactionId,
    message: result.message,
    pending_settlement: result.pendingSettlement ?? false,
  });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

async function notifyZac(subject: string, html: string) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "notifications@lightningledgerz.com",
      to: ZAC_EMAIL,
      subject,
      html,
    }),
  });
}
