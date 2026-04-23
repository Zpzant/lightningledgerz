/**
 * Bank of America Microform client.
 *
 * BoA Merchant Services currently processes via one of three underlying
 * rails — Worldpay/FIS, Cybersource, or Fiserv Commerce Hub — depending
 * on when the merchant account was opened and which platform was migrated.
 * This file abstracts that away: callers invoke createSession() and
 * capture(), and only this file knows which vendor-specific endpoint to hit.
 *
 * To finalize: ask Katie at BoA for the following, then drop them into
 * Supabase → Edge Functions → Env Vars (not committed to git):
 *   BOA_PROCESSOR                 "worldpay" | "cybersource" | "fiserv"
 *   BOA_API_BASE_URL              e.g. https://try.access.worldpay.com
 *   BOA_MERCHANT_ID               merchant identifier
 *   BOA_API_KEY                   public key / username
 *   BOA_API_SECRET                secret / password (HMAC signing key)
 *   BOA_WEBHOOK_SECRET            for verifying async webhooks
 *   BOA_MICROFORM_JS_URL          URL of the Microform JS SDK (served to clients)
 *   BOA_MICROFORM_ORIGIN_ALLOWLIST comma-separated origins you'll tokenize from
 *
 * Each processor's tokenize/capture request shape is slightly different.
 * The three adapters below implement the same interface so the rest of
 * the codebase stays processor-agnostic.
 */

export interface BoaSession {
  /** Short-lived key the frontend passes to Microform.createSession() */
  sessionKey: string;
  /** Optional JWT for cross-origin iframe handshake */
  clientToken?: string;
  /** Expiry in seconds since epoch */
  expiresAt: number;
}

export interface CaptureRequest {
  /** Microform token returned from the iframe after user submits card */
  transientToken: string;
  /** Amount in minor units (cents for USD) */
  amountCents: number;
  currency: string;
  /** Our invoice number / internal reference — shows up on customer statement */
  reference: string;
  /** Optional billing details for AVS */
  billingName?: string;
  billingEmail?: string;
  billingZip?: string;
  /** For ACH: routing + masked account already inside the transientToken */
  method: "card" | "ach";
}

export interface CaptureResult {
  ok: boolean;
  /** Processor-assigned transaction ID */
  processorTransactionId: string;
  /** Processor response code — processor-specific */
  responseCode: string;
  /** Human-readable message */
  message: string;
  /** Card brand and last4 (null for ACH) */
  cardBrand?: string | null;
  cardLast4?: string | null;
  /** Raw processor payload for audit (already sanitized — no PAN/CVV) */
  rawPayload: Record<string, unknown>;
  /** If this is an asynchronous method (ACH), true means authorized but
   *  not yet settled — final state comes via webhook. */
  pendingSettlement?: boolean;
}

export interface BoaClient {
  createSession(req: {
    amountCents: number;
    currency: string;
    reference: string;
    clientOrigins: string[];
  }): Promise<BoaSession>;

  capture(req: CaptureRequest): Promise<CaptureResult>;

  verifyWebhookSignature(
    rawBody: string,
    headers: Headers,
  ): Promise<boolean>;
}

// =====================================================================
// Adapter factory
// =====================================================================
export function boaClientFromEnv(): BoaClient {
  const processor = (Deno.env.get("BOA_PROCESSOR") ?? "").toLowerCase();
  switch (processor) {
    case "worldpay":
      return new WorldpayAdapter();
    case "cybersource":
      return new CybersourceAdapter();
    case "fiserv":
      return new FiservAdapter();
    default:
      return new StubAdapter(processor || "unconfigured");
  }
}

// =====================================================================
// Stub adapter — used in dev or when BOA_PROCESSOR is unset.
// Returns deterministic fake successes so the rest of the system works
// end-to-end before real credentials arrive.
// =====================================================================
class StubAdapter implements BoaClient {
  constructor(private label: string) {}

  createSession(): Promise<BoaSession> {
    return Promise.resolve({
      sessionKey: "stub_session_" + crypto.randomUUID(),
      clientToken: "stub_jwt",
      expiresAt: Math.floor(Date.now() / 1000) + 900,
    });
  }

  capture(req: CaptureRequest): Promise<CaptureResult> {
    // Simulate a card auth success unless the transientToken starts with "fail_"
    const fail = req.transientToken.startsWith("fail_");
    return Promise.resolve({
      ok: !fail,
      processorTransactionId: "stub_txn_" + crypto.randomUUID(),
      responseCode: fail ? "DECLINE" : "APPROVED",
      message: fail ? "Stub: simulated decline" : "Stub: simulated approval",
      cardBrand: req.method === "card" ? "VISA" : null,
      cardLast4: req.method === "card" ? "4242" : null,
      rawPayload: { _stub: true, _processor: this.label, reference: req.reference },
      pendingSettlement: req.method === "ach",
    });
  }

  verifyWebhookSignature(): Promise<boolean> {
    // Stub accepts all webhooks. Production must verify HMAC.
    return Promise.resolve(true);
  }
}

// =====================================================================
// Worldpay / FIS Access Worldpay adapter
//   Docs: https://developer.worldpay.com/docs/access-worldpay
// =====================================================================
class WorldpayAdapter implements BoaClient {
  private base = Deno.env.get("BOA_API_BASE_URL") ?? "https://try.access.worldpay.com";
  private username = Deno.env.get("BOA_API_KEY") ?? "";
  private password = Deno.env.get("BOA_API_SECRET") ?? "";
  private merchantId = Deno.env.get("BOA_MERCHANT_ID") ?? "";

  private authHeader(): string {
    return "Basic " + btoa(`${this.username}:${this.password}`);
  }

  async createSession(req: {
    amountCents: number;
    currency: string;
    reference: string;
    clientOrigins: string[];
  }): Promise<BoaSession> {
    // Worldpay tokenizer session endpoint returns a short-lived sessionState.
    const res = await fetch(`${this.base}/sessions`, {
      method: "POST",
      headers: {
        "Authorization": this.authHeader(),
        "Content-Type": "application/vnd.worldpay.sessions-v1+json",
        "Accept": "application/vnd.worldpay.sessions-v1+json",
      },
      body: JSON.stringify({
        merchant: { entity: this.merchantId },
        allowedOrigins: req.clientOrigins,
        reference: req.reference,
      }),
    });
    if (!res.ok) throw new Error(`Worldpay createSession failed: ${res.status} ${await res.text()}`);
    const body = await res.json();
    return {
      sessionKey: body.sessionState ?? body.session ?? "",
      clientToken: body.clientToken,
      expiresAt: Math.floor(Date.now() / 1000) + 900,
    };
  }

  async capture(req: CaptureRequest): Promise<CaptureResult> {
    // Worldpay Payments API: authorize-and-capture in a single request.
    const res = await fetch(`${this.base}/cardPayments/customerInitiatedTransactions`, {
      method: "POST",
      headers: {
        "Authorization": this.authHeader(),
        "Content-Type": "application/vnd.worldpay.payments-v7+json",
        "Accept": "application/vnd.worldpay.payments-v7+json",
      },
      body: JSON.stringify({
        transactionReference: req.reference,
        merchant: { entity: this.merchantId },
        instruction: {
          narrative: { line1: "Lightning Ledgerz" },
          value: { currency: req.currency, amount: req.amountCents },
          paymentInstrument: {
            type: "card/tokenized",
            href: req.transientToken,
          },
        },
        channel: "ecom",
      }),
    });
    const body = await res.json();
    const ok = res.ok && body.outcome === "authorized";
    return {
      ok,
      processorTransactionId: body.transactionId ?? body._links?.self?.href ?? "",
      responseCode: body.outcome ?? (res.ok ? "UNKNOWN" : String(res.status)),
      message: body.description ?? body.message ?? (ok ? "Authorized" : "Declined"),
      cardBrand: body.paymentInstrument?.brand ?? null,
      cardLast4: body.paymentInstrument?.lastFour ?? null,
      rawPayload: body,
      pendingSettlement: req.method === "ach",
    };
  }

  async verifyWebhookSignature(rawBody: string, headers: Headers): Promise<boolean> {
    // Worldpay signs with HMAC-SHA256 over (timestamp + body) using webhook secret.
    const signature = headers.get("worldpay-signature");
    const timestamp = headers.get("worldpay-timestamp");
    const secret = Deno.env.get("BOA_WEBHOOK_SECRET") ?? "";
    if (!signature || !timestamp || !secret) return false;
    const mac = await hmacSha256Hex(secret, `${timestamp}.${rawBody}`);
    return timingSafeEqual(mac, signature);
  }
}

// =====================================================================
// Cybersource adapter — stubbed signatures to fill in once confirmed.
// =====================================================================
class CybersourceAdapter implements BoaClient {
  createSession(): Promise<BoaSession> {
    throw new Error("Cybersource adapter not implemented — fill in once BoA confirms processor.");
  }
  capture(): Promise<CaptureResult> {
    throw new Error("Cybersource adapter not implemented.");
  }
  verifyWebhookSignature(): Promise<boolean> {
    throw new Error("Cybersource adapter not implemented.");
  }
}

// =====================================================================
// Fiserv Commerce Hub adapter — stubbed.
// =====================================================================
class FiservAdapter implements BoaClient {
  createSession(): Promise<BoaSession> {
    throw new Error("Fiserv adapter not implemented — fill in once BoA confirms processor.");
  }
  capture(): Promise<CaptureResult> {
    throw new Error("Fiserv adapter not implemented.");
  }
  verifyWebhookSignature(): Promise<boolean> {
    throw new Error("Fiserv adapter not implemented.");
  }
}

// =====================================================================
// Crypto helpers
// =====================================================================
async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
