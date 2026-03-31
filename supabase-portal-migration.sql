-- =============================================
-- Lightning Ledgerz — Portal Persistence Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add token persistence columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS token_balance INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tokens_credited_months TEXT[] DEFAULT '{}';

-- 2. Add meter/milestone persistence columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS call_booked_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meter_milestones JSONB DEFAULT '{}';

-- 3. Create report_requests table (if not exists)
CREATE TABLE IF NOT EXISTS report_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL,
    report_title TEXT NOT NULL,
    notes TEXT,
    recurring BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for report_requests
ALTER TABLE report_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users view own report requests"
    ON report_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users create own report requests"
    ON report_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can view and manage all requests
CREATE POLICY "Admins manage all report requests"
    ON report_requests FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- 4. Create user_reports table (admin uploads to clients)
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_name TEXT NOT NULL,
    report_description TEXT,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for user_reports
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Users can only view their own reports
CREATE POLICY "Users view own reports"
    ON user_reports FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can manage all reports (upload to any client)
CREATE POLICY "Admins manage all reports"
    ON user_reports FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- 5. Create user_files table (client uploads — P&L, BS, CF)
CREATE TABLE IF NOT EXISTS user_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT,
    file_type TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for user_files
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own files"
    ON user_files FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Admins view all files"
    ON user_files FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- 6. Create platform_credentials table
CREATE TABLE IF NOT EXISTS platform_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    platform_name TEXT,
    access_type TEXT DEFAULT 'credentials',
    login_url TEXT,
    username TEXT,
    password TEXT,
    notes TEXT,
    permission_granted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for platform_credentials
ALTER TABLE platform_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own credentials"
    ON platform_credentials FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Admins view credentials"
    ON platform_credentials FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- 7. Create dashboard_links table
CREATE TABLE IF NOT EXISTS dashboard_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dashboard_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dashboard_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own dashboard links"
    ON dashboard_links FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all dashboard links"
    ON dashboard_links FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );
