# Password Recovery — Setup & Verification

The "Forgot password?" flow is fully wired in code (modal → email → `/reset-password.html` → password update). What's left is **two manual steps in the Supabase dashboard** so the recovery emails actually send and the redirect URL is allowed.

---

## Already done (in code, deployed)

- [x] **"Forgot password?" link** in the sign-in modal opens `forgot-password-overlay`.
- [x] **`handleForgotPassword()`** in [`index.html`](index.html) (around line 10306) calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://lightningledgerz.com/reset-password.html' })`.
- [x] **Resend reset email** button works once the success state is shown.
- [x] **[`reset-password.html`](reset-password.html)** listens for the `PASSWORD_RECOVERY` auth event, shows the new-password form, validates length + match, calls `supabase.auth.updateUser({ password })`, redirects on success.
- [x] **Cleaned up dead duplicate handlers** in [`app.js`](app.js) (they targeted IDs that no longer exist and were never firing).
- [x] **Branded email template** ready to paste at [`supabase/email-templates/reset-password.html`](supabase/email-templates/reset-password.html).

---

## Step 1 — Allow the reset-password redirect URL

Without this, Supabase will reject the recovery link with `redirect_to is not allowed`.

1. Open https://supabase.com/dashboard/project/uxicgilvxcqpoxavilxp/auth/url-configuration
2. **Site URL**: `https://lightningledgerz.com`
3. **Redirect URLs** — add each on its own line:
   ```
   https://lightningledgerz.com
   https://lightningledgerz.com/
   https://lightningledgerz.com/reset-password.html
   https://www.lightningledgerz.com
   https://www.lightningledgerz.com/
   https://www.lightningledgerz.com/reset-password.html
   ```
4. Click **Save**.

---

## Step 2 — Paste the branded email template

Default Supabase emails are plain text and look like phishing. Use the branded template instead.

1. Open https://supabase.com/dashboard/project/uxicgilvxcqpoxavilxp/auth/templates
2. Click the **Reset Password** tab.
3. **Subject**: `Reset your Lightning Ledgerz password`
4. **Message body (HTML)**: open [`supabase/email-templates/reset-password.html`](supabase/email-templates/reset-password.html), copy everything from `<!DOCTYPE html>` to `</html>`, paste into the body box.
5. Click **Save**.

The template already uses Supabase's variable substitutions:
- `{{ .ConfirmationURL }}` — the actual recovery link
- `{{ .Email }}` — the recipient's address

---

## Step 3 — Test it end-to-end (5 minutes)

1. Sign out of your account on the live site.
2. Click **Sign In** → **Forgot password?**
3. Enter your email, hit **Send Reset Link**.
4. You should see "If [your email] matches an address we have on file, I've sent you a link…"
5. Check your inbox (and spam folder, free-tier Supabase emails sometimes land there).
6. Click the link → you should land on `/reset-password.html` with the new-password form.
7. Set a new password → it should auto-redirect home and you're signed in.

If anything breaks at step 3 → it's the Site URL setting (Step 1).
If the link fails at step 6 → it's the redirect URL allowlist (Step 1).
If the email never arrives → it's likely deliverability / spam (see Step 4 below).

---

## Step 4 (optional but recommended) — Branded sender via Resend

By default Supabase sends from `noreply@mail.app.supabase.io`, which Gmail/Outlook often dump into spam. You already have **Resend** wired up for Stripe webhook notifications, so you can route Supabase auth emails through it too — emails will come from `noreply@lightningledgerz.com` and bypass spam filters.

1. In Resend, verify the `lightningledgerz.com` domain (DNS records: SPF, DKIM, DMARC).
2. Create a Resend SMTP credential at https://resend.com/settings/smtp
3. In Supabase: https://supabase.com/dashboard/project/uxicgilvxcqpoxavilxp/auth/providers → scroll to **SMTP Settings** → toggle **Enable Custom SMTP**.
4. Enter:
   - **Sender email**: `noreply@lightningledgerz.com`
   - **Sender name**: `Lightning Ledgerz`
   - **Host**: `smtp.resend.com`
   - **Port**: `465`
   - **Username**: `resend`
   - **Password**: (the API key from Resend)
5. Click **Save** and send a test using the **Reset Password** template.

---

## Free-tier email rate limit

Supabase free tier limits auth emails to **2 per hour per address** and ~30/hour total. If clients are bulk-resetting passwords during onboarding, custom SMTP via Resend (Step 4) removes that limit.

---

## Why I didn't push these dashboard changes for you

Supabase dashboard configuration cannot be changed via the API or CLI without a service-role token tied to your account — and that token can't be safely committed to a public repo. Email templates and URL allowlists have to be set in the dashboard once, by you. After that they're permanent and never need to be touched again unless you change domains.
