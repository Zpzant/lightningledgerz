# BoA Microform — One-Off Invoice Payments Setup

Lightning Ledgerz one-off invoice payment flow, wired to Bank of America Merchant Services Microform (Card-Not-Present + ACH). Stripe continues to handle subscription billing — these two systems coexist.

---

## What's already built and deployed

Code is live on `main`. Nothing needs to change in the repo to finish the integration — only environment variables and the one SQL migration below.

**Frontend:**
- [`pay.html`](pay.html) — client-facing payment page. URL: `https://lightningledgerz.com/pay.html?token=<payment_token>`
- [`admin-invoices.html`](admin-invoices.html) — admin UI to create invoices, copy payment links, void. Admin-only (gated by `profiles.is_admin`).

**Backend (Supabase Edge Functions):**
- `supabase/functions/create-payment-session/index.ts` — resolves an invoice by `payment_token` and asks BoA for a tokenizer session.
- `supabase/functions/process-payment/index.ts` — takes the tokenized card/ACH back from the Microform iframe and calls BoA to charge it; writes results to the `payments` table.
- `supabase/functions/boa-webhook/index.ts` — receives async events (ACH settle, chargebacks, refunds).
- `supabase/functions/_shared/boa-client.ts` — processor-agnostic abstraction. Works with Worldpay out of the box; Cybersource and Fiserv stubs can be filled in if BoA uses one of those.

**Database:**
- `supabase/invoices-migration.sql` — invoices, payments, payment_tokens tables with Row-Level Security so clients only see their own invoices and admins see everything.

**Current state: stub mode.** Until the env vars below are set, `boa-client.ts` uses a `StubAdapter` that returns fake successful payments. This lets you test the whole flow end-to-end (invoice → admin UI → client pay page → payment row written → Zac notified) before live rails are wired.

---

## Step-by-step: go live

### 1. Run the SQL migration

Open [Supabase SQL Editor](https://supabase.com/dashboard/project/uxicgilvxcqpoxavilxp/sql/new), paste the contents of [`supabase/invoices-migration.sql`](supabase/invoices-migration.sql), run it. You'll see three tables appear in **Table Editor**: `invoices`, `payments`, `payment_tokens`.

### 2. Deploy the three Edge Functions

From a terminal in the project root:

```bash
# First time only — log into Supabase CLI
~/supabase-cli/supabase.exe login

# Link to this project
~/supabase-cli/supabase.exe link --project-ref uxicgilvxcqpoxavilxp

# Deploy
~/supabase-cli/supabase.exe functions deploy create-payment-session
~/supabase-cli/supabase.exe functions deploy process-payment
~/supabase-cli/supabase.exe functions deploy boa-webhook
```

Or deploy via the Supabase dashboard: **Edge Functions → Deploy function → upload each folder**.

### 3. Mark yourself as admin

In SQL editor:

```sql
UPDATE public.profiles SET is_admin = TRUE WHERE email = 'zprizant@lightningledgerz.com';
```

Log in at `https://lightningledgerz.com/#client-portal`, then go to `https://lightningledgerz.com/admin-invoices.html`. You should see the admin UI. Create a test invoice for yourself. Click "Copy link," open it in a new tab — in stub mode, click "Pay $X" and it'll simulate a success.

### 4. Get the BoA Microform credentials from Katie

Text / email Katie with these exact asks:

> Hi Katie — ready to set up Microform. Can you send me:
> 1. The **underlying processor** my merchant account runs on — Worldpay/FIS, Cybersource, or Fiserv Commerce Hub?
> 2. **API endpoint / base URL** for my sandbox and production (different URLs per environment).
> 3. **Merchant ID**, **API key**, **API secret** for both sandbox and production.
> 4. **Microform JavaScript SDK URL** — the script tag I should include on my payment page.
> 5. **Webhook signing secret** — so I can verify async callbacks.
> 6. **Origin allowlist** — the list of my domains that should be whitelisted to tokenize (I'll use `https://lightningledgerz.com` and `https://www.lightningledgerz.com`).
> 7. **Sandbox test card numbers** + an ACH test routing/account to run through approval + decline flows.

### 5. Set environment variables in Supabase

Dashboard → **Project Settings → Edge Functions → Secrets**. Paste these (values from Katie):

| Key | Value |
|---|---|
| `BOA_PROCESSOR` | `worldpay` (or `cybersource` / `fiserv`) |
| `BOA_API_BASE_URL` | e.g. `https://try.access.worldpay.com` |
| `BOA_MERCHANT_ID` | from Katie |
| `BOA_API_KEY` | from Katie |
| `BOA_API_SECRET` | from Katie |
| `BOA_WEBHOOK_SECRET` | from Katie |
| `BOA_MICROFORM_JS_URL` | the SDK URL Katie provides |
| `BOA_MICROFORM_ORIGIN_ALLOWLIST` | `https://lightningledgerz.com,https://www.lightningledgerz.com` |
| `RESEND_API_KEY` | already set (Stripe webhook uses same key) |

### 6. Register the webhook URL with BoA

Tell Katie to register this URL in the BoA/Worldpay dashboard:

```
https://uxicgilvxcqpoxavilxp.supabase.co/functions/v1/boa-webhook
```

Events to enable: `payment.settled`, `payment.failed`, `payment.refunded`, `payment.chargeback_opened`.

### 7. Run a $1 test in sandbox

1. Create an invoice for `$1.00` in the admin UI.
2. Open the payment link in an incognito window.
3. Use a BoA sandbox card number.
4. Confirm:
   - Edge Function logs show the real `capture()` call (not the stub).
   - `payments` table gets a row with `status='captured'` and real `processor_transaction_id`.
   - `invoices` row moves to `status='paid'`.
   - You get the "💰 Payment captured" email.

Once that works, test ACH with the sandbox routing/account Katie provides. ACH should land in `status='authorized'` immediately, then move to `settled` when the webhook fires 2–3 days later.

### 8. Go live

Once sandbox end-to-end works, swap the env vars to production values and ship.

---

## Adjusting the processor adapter

If BoA confirms **Worldpay**, you're done — the Worldpay adapter in `_shared/boa-client.ts` is complete.

If BoA confirms **Cybersource** or **Fiserv Commerce Hub**, open `supabase/functions/_shared/boa-client.ts` and fill in the `CybersourceAdapter` or `FiservAdapter` class. The interface (`createSession`, `capture`, `verifyWebhookSignature`) stays the same — only the HTTP shapes differ. Each vendor has straightforward REST docs:

- Cybersource Flex Microform: https://developer.cybersource.com/docs/cybs/en-us/flex-microform/developer/all/rest/flex-microform-intro.html
- Fiserv Commerce Hub: https://docs.fiserv.dev/

The code in `process-payment/index.ts` does not change — it just calls `boaClientFromEnv()` and lets the adapter handle the specifics.

---

## Security notes

- **Card data never touches your servers.** The Microform iframe tokenizes inside BoA's domain; your Edge Function only ever sees an opaque `transient_token`.
- `payments.processor_payload` stores the raw response for audit but PAN/CVV are stripped by BoA before responding.
- RLS policies ensure a client can only ever read their own invoices/payments even if someone tampers with frontend queries.
- Webhook signature verification is in the Worldpay adapter (`hmacSha256Hex` + `timingSafeEqual`). Do not skip this — an unsigned webhook endpoint lets an attacker mark invoices paid.
- The shareable `payment_token` on each invoice is a 32-character random string (256 bits of entropy); it expires after 90 days by default.

---

## What NOT to confuse this with

- **Stripe subscriptions** (monthly retainers) — handled separately by `stripe-webhook` function. Not changing.
- **QuickBooks integration** — separate concern. See the audit memory for the state of that work.
- **Client portal login** — Supabase Auth (Google + email/password). The admin page and pay page both use that same auth session.
