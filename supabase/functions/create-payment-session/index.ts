/**
 * POST /functions/v1/create-payment-session
 *
 * Called from pay.html right before rendering the Microform card fields.
 * Resolves the invoice by its shareable payment_token, confirms it's still
 * payable (not already paid, not expired), then asks BoA for a short-lived
 * session key that the frontend hands to Microform.createSession().
 *
 * Request:  { payment_token: string }
 * Response: {
 *   session_key, client_token, expires_at,
 *   invoice: { number, client_name, amount_cents, currency, description },
 *   microform_script_url
 * }
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { boaClientFromEnv } from "../_shared/boa-client.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload: { payment_token?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const paymentToken = payload.payment_token?.trim();
  if (!paymentToken) {
    return json({ error: "payment_token required" }, 400);
  }

  // 1. Look up the invoice by its shareable token.
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_name, client_email, amount_cents, currency, description, status, payment_token_expires_at")
    .eq("payment_token", paymentToken)
    .maybeSingle();

  if (error) return json({ error: "Lookup failed" }, 500);
  if (!invoice) return json({ error: "Invoice not found or link expired" }, 404);
  if (invoice.status === "paid") {
    return json({ error: "This invoice has already been paid." }, 410);
  }
  if (invoice.status === "voided") {
    return json({ error: "This invoice has been voided." }, 410);
  }
  if (invoice.payment_token_expires_at && new Date(invoice.payment_token_expires_at) < new Date()) {
    return json({ error: "Payment link expired. Please request a new one." }, 410);
  }

  // 2. Ask BoA for a tokenizer session.
  const allowedOrigins = (Deno.env.get("BOA_MICROFORM_ORIGIN_ALLOWLIST") ?? "https://lightningledgerz.com,https://www.lightningledgerz.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let session;
  try {
    const boa = boaClientFromEnv();
    session = await boa.createSession({
      amountCents: invoice.amount_cents,
      currency: invoice.currency,
      reference: invoice.invoice_number,
      clientOrigins: allowedOrigins,
    });
  } catch (e) {
    console.error("BoA createSession failed:", e);
    return json({ error: "Payment provider is temporarily unavailable." }, 502);
  }

  // 3. Return just enough for the frontend to render the form + bootstrap Microform.
  return json({
    session_key: session.sessionKey,
    client_token: session.clientToken,
    expires_at: session.expiresAt,
    microform_script_url: Deno.env.get("BOA_MICROFORM_JS_URL") ?? "",
    invoice: {
      number: invoice.invoice_number,
      client_name: invoice.client_name,
      client_email: invoice.client_email,
      amount_cents: invoice.amount_cents,
      currency: invoice.currency,
      description: invoice.description,
    },
  });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
