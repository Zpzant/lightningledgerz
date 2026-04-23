-- =====================================================
-- LIGHTNING LEDGERZ — ONE-OFF INVOICE + PAYMENT SCHEMA
-- =====================================================
-- Run this in Supabase → SQL Editor after supabase-setup.sql.
-- Creates the plumbing for Microform-backed one-off invoicing
-- (Stripe continues to handle subscriptions separately).

-- -----------------------------------------------------
-- 1. INVOICES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Human-readable invoice number (INV-2026-0001). Unique, indexed.
    invoice_number      TEXT UNIQUE NOT NULL,
    -- Optional link to an authenticated client profile.
    -- Allows null so Zac can invoice non-portal clients too.
    client_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Contact details captured at invoice creation (denormalized so the
    -- invoice is complete even if the profile changes later).
    client_name         TEXT NOT NULL,
    client_email        TEXT NOT NULL,
    client_company      TEXT,
    -- Line items as JSON (simple — avoids a separate line_items table for v1).
    -- Example: [{"description":"April retainer","quantity":1,"unit_price_cents":250000}]
    line_items          JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Totals in cents to avoid floating-point rounding.
    subtotal_cents      INTEGER NOT NULL DEFAULT 0,
    tax_cents           INTEGER NOT NULL DEFAULT 0,
    amount_cents        INTEGER NOT NULL CHECK (amount_cents > 0),
    currency            CHAR(3) NOT NULL DEFAULT 'USD',
    -- State machine: draft -> sent -> paid | partial | failed | voided
    status              TEXT NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','sent','paid','partial','failed','voided')),
    -- Free-form notes shown on the invoice.
    description         TEXT,
    notes               TEXT,
    due_date            DATE,
    issued_at           TIMESTAMP WITH TIME ZONE,
    paid_at             TIMESTAMP WITH TIME ZONE,
    -- Shareable payment link slug (random, hard to guess).
    -- Used for /pay.html?token=<payment_token>.
    payment_token       TEXT UNIQUE,
    payment_token_expires_at TIMESTAMP WITH TIME ZONE,
    created_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id     ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status        ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_token ON public.invoices(payment_token);

-- -----------------------------------------------------
-- 2. PAYMENT ATTEMPTS
-- -----------------------------------------------------
-- One invoice can have multiple payment attempts (failed card, retry with ACH, etc.).
CREATE TABLE IF NOT EXISTS public.payments (
    id                      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id              UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    -- 'card' or 'ach' or 'manual' (for recording a wire/check outside the gateway)
    method                  TEXT NOT NULL CHECK (method IN ('card','ach','manual')),
    amount_cents            INTEGER NOT NULL CHECK (amount_cents > 0),
    currency                CHAR(3) NOT NULL DEFAULT 'USD',
    -- pending -> authorized -> captured -> settled (or failed / refunded)
    status                  TEXT NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','authorized','captured','settled','failed','refunded','voided')),
    -- Processor identifiers (BoA Microform / Worldpay / Cybersource)
    processor               TEXT DEFAULT 'boa_microform',
    processor_transaction_id TEXT,
    processor_reference     TEXT,
    processor_response_code TEXT,
    processor_message       TEXT,
    -- Non-sensitive card metadata — never store PAN or CVV.
    card_brand              TEXT,
    card_last4              TEXT,
    card_exp_month          INTEGER,
    card_exp_year           INTEGER,
    -- Raw processor payload, trimmed of PAN/CVV, for audit.
    processor_payload       JSONB,
    authorized_at           TIMESTAMP WITH TIME ZONE,
    captured_at             TIMESTAMP WITH TIME ZONE,
    settled_at              TIMESTAMP WITH TIME ZONE,
    failed_at               TIMESTAMP WITH TIME ZONE,
    refunded_at             TIMESTAMP WITH TIME ZONE,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id               ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status                   ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_processor_transaction_id ON public.payments(processor_transaction_id);

-- -----------------------------------------------------
-- 3. SAVED PAYMENT TOKENS (for future one-click pay)
-- -----------------------------------------------------
-- Only stores the tokenization reference returned by Microform — never raw card data.
CREATE TABLE IF NOT EXISTS public.payment_tokens (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    processor       TEXT DEFAULT 'boa_microform',
    -- Tokenized card / ACH reference from BoA — opaque string.
    token_reference TEXT NOT NULL,
    -- Non-sensitive display metadata.
    method          TEXT CHECK (method IN ('card','ach')),
    card_brand      TEXT,
    card_last4      TEXT,
    card_exp_month  INTEGER,
    card_exp_year   INTEGER,
    bank_name       TEXT,
    bank_last4      TEXT,
    is_default      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_tokens_client_id ON public.payment_tokens(client_id);

-- -----------------------------------------------------
-- 4. ROW-LEVEL SECURITY
-- -----------------------------------------------------
ALTER TABLE public.invoices       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_tokens ENABLE ROW LEVEL SECURITY;

-- Clients can see only their own invoices
DROP POLICY IF EXISTS "clients view own invoices" ON public.invoices;
CREATE POLICY "clients view own invoices"
    ON public.invoices FOR SELECT
    USING (client_id = auth.uid());

-- Admins can see / do everything
DROP POLICY IF EXISTS "admins manage invoices" ON public.invoices;
CREATE POLICY "admins manage invoices"
    ON public.invoices FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Clients can see payments tied to their invoices
DROP POLICY IF EXISTS "clients view own payments" ON public.payments;
CREATE POLICY "clients view own payments"
    ON public.payments FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.client_id = auth.uid()));

DROP POLICY IF EXISTS "admins manage payments" ON public.payments;
CREATE POLICY "admins manage payments"
    ON public.payments FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Clients manage their own saved payment methods
DROP POLICY IF EXISTS "clients manage own tokens" ON public.payment_tokens;
CREATE POLICY "clients manage own tokens"
    ON public.payment_tokens FOR ALL
    USING (client_id = auth.uid())
    WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "admins view all tokens" ON public.payment_tokens;
CREATE POLICY "admins view all tokens"
    ON public.payment_tokens FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- -----------------------------------------------------
-- 5. HELPER: auto-update updated_at on row change
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_invoices_touch ON public.invoices;
CREATE TRIGGER trg_invoices_touch BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_payments_touch ON public.payments;
CREATE TRIGGER trg_payments_touch BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- -----------------------------------------------------
-- 6. HELPER: generate next invoice number
-- -----------------------------------------------------
-- Returns INV-YYYY-NNNN, numeric suffix zero-padded, monotonically increasing per year.
CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS TEXT AS $$
DECLARE
    yr INTEGER := EXTRACT(YEAR FROM NOW())::INTEGER;
    seq INTEGER;
BEGIN
    SELECT COALESCE(
        MAX(SUBSTRING(invoice_number FROM 'INV-' || yr || '-([0-9]+)')::INTEGER),
        0
    ) + 1
    INTO seq
    FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || yr || '-%';

    RETURN 'INV-' || yr || '-' || LPAD(seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
