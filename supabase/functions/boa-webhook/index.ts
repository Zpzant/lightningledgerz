/**
 * POST /functions/v1/boa-webhook
 *
 * Receives asynchronous event callbacks from BoA / Worldpay. Primary use
 * cases:
 *   - ACH payment settles (or is returned / NSF)
 *   - Card chargeback or dispute opened
 *   - Refund completed
 *
 * Configure the URL in the BoA/Worldpay dashboard as:
 *   https://<your-supabase-project>.supabase.co/functions/v1/boa-webhook
 *
 * Signature verification is delegated to the processor-specific adapter
 * (see _shared/boa-client.ts).
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

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const raw = await req.text();
  const boa = boaClientFromEnv();

  const valid = await boa.verifyWebhookSignature(raw, req.headers);
  if (!valid) {
    console.warn("Webhook signature verification failed");
    return new Response("Invalid signature", { status: 401 });
  }

  let event: {
    eventType?: string;
    transactionId?: string;
    reference?: string;
    status?: string;
    amountCents?: number;
    [k: string]: unknown;
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Map BoA event types to our state transitions. Shape will need minor
  // tweaks once Worldpay/Cybersource specifics are confirmed, but the
  // pattern is stable.
  const txId = event.transactionId ?? (event.payment as any)?.transactionId;
  const ref = event.reference ?? (event.payment as any)?.reference;

  if (!txId && !ref) {
    console.warn("Webhook with neither transactionId nor reference:", event.eventType);
    return new Response("ok", { status: 200 });
  }

  // Find the payment by processor_transaction_id (preferred) or invoice reference.
  const query = supabase.from("payments").select("id, invoice_id, status");
  const { data: payment } = txId
    ? await query.eq("processor_transaction_id", txId).maybeSingle()
    : await query.eq("processor_reference", ref!).maybeSingle();

  if (!payment) {
    console.warn("Webhook for unknown payment:", txId, ref);
    return new Response("ok", { status: 200 });
  }

  const now = new Date().toISOString();
  const et = (event.eventType ?? "").toLowerCase();

  if (et.includes("settled") || et.includes("captured")) {
    await supabase.from("payments").update({
      status: "settled",
      settled_at: now,
    }).eq("id", payment.id);
    await supabase.from("invoices").update({
      status: "paid",
      paid_at: now,
    }).eq("id", payment.invoice_id);
    await notifyZac("💰 ACH settled", `Payment ${payment.id} settled to your bank.`);
  } else if (et.includes("failed") || et.includes("declined") || et.includes("returned")) {
    await supabase.from("payments").update({
      status: "failed",
      failed_at: now,
      processor_message: String(event.status ?? "failed"),
    }).eq("id", payment.id);
    await supabase.from("invoices").update({ status: "failed" }).eq("id", payment.invoice_id);
    await notifyZac(
      "⚠️ Payment failed (async)",
      `Payment ${payment.id} failed: ${event.status ?? "unknown reason"}. Check BoA dashboard.`,
    );
  } else if (et.includes("refunded")) {
    await supabase.from("payments").update({
      status: "refunded",
      refunded_at: now,
    }).eq("id", payment.id);
  } else if (et.includes("chargeback") || et.includes("dispute")) {
    await notifyZac(
      "🚨 Chargeback / dispute opened",
      `Payment ${payment.id} has a dispute. Log in to BoA / Worldpay to respond.`,
    );
  }

  return new Response("ok", { status: 200 });
});

async function notifyZac(subject: string, html: string) {
  if (!RESEND_KEY) return;
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
