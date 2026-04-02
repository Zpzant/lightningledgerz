-- ============================================
-- LIGHTNING LEDGERZ: Admin Dashboard Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add tracking columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_paid NUMERIC DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits_used_month INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits_used_year INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits_month_key TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_services TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_start_date TIMESTAMPTZ;

-- 2. Admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,  -- 'signup', 'bookkeeping_selected', 'qb_connected', 'report_ordered', 'file_uploaded'
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    metadata JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all notifications"
    ON admin_notifications FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin can update notifications"
    ON admin_notifications FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Any authenticated user can insert notifications"
    ON admin_notifications FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Coin purchases table (buy extra without upgrading)
CREATE TABLE IF NOT EXISTS coin_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coins_purchased INTEGER NOT NULL,
    amount_paid NUMERIC NOT NULL,
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coin_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coin purchases"
    ON coin_purchases FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all coin purchases"
    ON coin_purchases FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Users can insert own coin purchases"
    ON coin_purchases FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 4. Admin read policy on quickbooks_connections (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quickbooks_connections') THEN
        EXECUTE 'CREATE POLICY "Admin can view all QB connections" ON quickbooks_connections FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE))';
    END IF;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Also try qb_connections (alternate table name used in code)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qb_connections') THEN
        EXECUTE 'CREATE POLICY "Admin can view all QB connections" ON qb_connections FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE))';
    END IF;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- 5. Create report_requests if missing
CREATE TABLE IF NOT EXISTS report_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type TEXT,
    report_title TEXT,
    notes TEXT,
    recurring BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE report_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view own report requests" ON report_requests FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own report requests" ON report_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin can view all report requests" ON report_requests FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin can update all report requests" ON report_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. Create user_files if missing
CREATE TABLE IF NOT EXISTS user_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT,
    file_url TEXT,
    file_type TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view own files" ON user_files FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own files" ON user_files FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin can view all files" ON user_files FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. Create user_reports if missing (admin uploads to clients)
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_name TEXT,
    report_description TEXT,
    file_path TEXT,
    file_url TEXT,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view own reports" ON user_reports FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admin can manage all reports" ON user_reports FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8. Indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_report_requests_user ON report_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_user ON user_files(user_id);
