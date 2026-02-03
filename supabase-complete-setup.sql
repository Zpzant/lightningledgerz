-- =============================================
-- LIGHTNING LEDGERZ - COMPLETE SUPABASE SETUP
-- Run this ONCE in Supabase SQL Editor
-- =============================================

-- ===========================================
-- 1. PROFILES TABLE (for user data)
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    phone TEXT,
    referral_code TEXT,
    tier TEXT DEFAULT 'basic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ===========================================
-- 2. ADMIN FUNCTION
-- ===========================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT email FROM auth.users WHERE id = auth.uid()
    ) = 'zprizant@lightningledgerz.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can view all profiles
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
CREATE POLICY "Admin can view all profiles" ON profiles
    FOR SELECT USING (is_admin());

-- Admin can update all profiles (to change tiers)
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
CREATE POLICY "Admin can update all profiles" ON profiles
    FOR UPDATE USING (is_admin());

-- ===========================================
-- 3. USER DOCUMENTS TABLE (user uploads)
-- ===========================================
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT,
    file_url TEXT,
    file_size BIGINT,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own documents
DROP POLICY IF EXISTS "Users can view own documents" ON user_documents;
CREATE POLICY "Users can view own documents" ON user_documents
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own documents
DROP POLICY IF EXISTS "Users can insert own documents" ON user_documents;
CREATE POLICY "Users can insert own documents" ON user_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own documents
DROP POLICY IF EXISTS "Users can delete own documents" ON user_documents;
CREATE POLICY "Users can delete own documents" ON user_documents
    FOR DELETE USING (auth.uid() = user_id);

-- Admin can view all documents
DROP POLICY IF EXISTS "Admin can view all documents" ON user_documents;
CREATE POLICY "Admin can view all documents" ON user_documents
    FOR SELECT USING (is_admin());

-- ===========================================
-- 4. USER REPORTS TABLE (admin uploads for users)
-- ===========================================
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_name TEXT NOT NULL,
    report_description TEXT,
    file_path TEXT,
    file_url TEXT,
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
DROP POLICY IF EXISTS "Users can view own reports" ON user_reports;
CREATE POLICY "Users can view own reports" ON user_reports
    FOR SELECT USING (auth.uid() = user_id);

-- Admin can manage all reports
DROP POLICY IF EXISTS "Admin can manage all reports" ON user_reports;
CREATE POLICY "Admin can manage all reports" ON user_reports
    FOR ALL USING (is_admin());

-- ===========================================
-- 5. PROMO CODES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    expiry_date TIMESTAMP WITH TIME ZONE,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Admin can manage promo codes
DROP POLICY IF EXISTS "Admin can manage promo codes" ON promo_codes;
CREATE POLICY "Admin can manage promo codes" ON promo_codes
    FOR ALL USING (is_admin());

-- Anyone can read active promo codes (to validate)
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON promo_codes;
CREATE POLICY "Anyone can read active promo codes" ON promo_codes
    FOR SELECT USING (is_active = TRUE);

-- ===========================================
-- 6. USER PROMO CODES TRACKING
-- ===========================================
CREATE TABLE IF NOT EXISTS user_promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, promo_code_id)
);

ALTER TABLE user_promo_codes ENABLE ROW LEVEL SECURITY;

-- Users can see their own promo usage
DROP POLICY IF EXISTS "Users can view own promo usage" ON user_promo_codes;
CREATE POLICY "Users can view own promo usage" ON user_promo_codes
    FOR SELECT USING (auth.uid() = user_id);

-- Admin can see all promo usage
DROP POLICY IF EXISTS "Admin can view all promo usage" ON user_promo_codes;
CREATE POLICY "Admin can view all promo usage" ON user_promo_codes
    FOR SELECT USING (is_admin());

-- ===========================================
-- 7. INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_user_id ON user_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- ===========================================
-- 8. GRANT PERMISSIONS
-- ===========================================
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON user_documents TO authenticated;
GRANT ALL ON user_reports TO authenticated;
GRANT ALL ON promo_codes TO authenticated;
GRANT ALL ON user_promo_codes TO authenticated;

-- ===========================================
-- 9. AUTO-CREATE PROFILE ON SIGNUP (TRIGGER)
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        'basic'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DONE!
--
-- Admin email: zprizant@lightningledgerz.com
--
-- NEXT STEPS:
-- 1. Go to Storage and create bucket "user-documents" (Private)
-- 2. Add storage policies (see below)
-- 3. Enable Google OAuth in Authentication > Providers
-- =============================================

/*
STORAGE POLICIES - Run these in Storage > user-documents > Policies:

-- Users upload to their own folder
CREATE POLICY "Users upload own files" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'user-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Users read their own files
CREATE POLICY "Users view own files" ON storage.objects
FOR SELECT USING (
    bucket_id = 'user-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Users delete their own files
CREATE POLICY "Users delete own files" ON storage.objects
FOR DELETE USING (
    bucket_id = 'user-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Admin can access all files
CREATE POLICY "Admin all access" ON storage.objects
FOR ALL USING (
    bucket_id = 'user-documents' AND
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'zprizant@lightningledgerz.com'
);
*/
