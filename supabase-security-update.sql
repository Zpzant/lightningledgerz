-- =============================================
-- LIGHTNING LEDGERZ - SECURITY & REPORTS UPDATE
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Create user_reports table for admin to upload deliverables
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

-- 2. Add company and phone columns to profiles if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- 3. Enable RLS on all tables
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- 4. DROP existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can view own reports" ON user_reports;
DROP POLICY IF EXISTS "Admin can manage all reports" ON user_reports;

-- 5. RLS Policies for user_documents
-- Users can only see their own uploaded documents
CREATE POLICY "Users can view own documents" ON user_documents
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own documents
CREATE POLICY "Users can insert own documents" ON user_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own documents
CREATE POLICY "Users can delete own documents" ON user_documents
    FOR DELETE USING (auth.uid() = user_id);

-- 6. RLS Policies for user_reports
-- Users can only see reports assigned to them
CREATE POLICY "Users can view own reports" ON user_reports
    FOR SELECT USING (auth.uid() = user_id);

-- ADMIN POLICY: You (Zac) need to be able to:
-- 1. See ALL user documents
-- 2. Upload reports FOR any user
-- To do this, we'll create a service role or check for your specific email

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT email FROM auth.users WHERE id = auth.uid()
    ) = 'zprizant@lightningledgerz.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can view all documents
CREATE POLICY "Admin can view all documents" ON user_documents
    FOR SELECT USING (is_admin());

-- Admin can manage all reports (insert, update, delete)
CREATE POLICY "Admin can manage all reports" ON user_reports
    FOR ALL USING (is_admin());

-- 7. Storage bucket policies for user-documents
-- IMPORTANT: Run these in Supabase Dashboard > Storage > user-documents > Policies

-- Policy: Users can upload to their own folder
-- CREATE POLICY "Users upload own files" ON storage.objects
-- FOR INSERT WITH CHECK (
--     bucket_id = 'user-documents' AND
--     auth.uid()::text = (storage.foldername(name))[1]
-- );

-- Policy: Users can read their own files
-- CREATE POLICY "Users view own files" ON storage.objects
-- FOR SELECT USING (
--     bucket_id = 'user-documents' AND
--     auth.uid()::text = (storage.foldername(name))[1]
-- );

-- Policy: Users can delete their own files
-- CREATE POLICY "Users delete own files" ON storage.objects
-- FOR DELETE USING (
--     bucket_id = 'user-documents' AND
--     auth.uid()::text = (storage.foldername(name))[1]
-- );

-- Policy: Admin can access all files
-- CREATE POLICY "Admin all access" ON storage.objects
-- FOR ALL USING (
--     bucket_id = 'user-documents' AND
--     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
-- );

-- ALTERNATIVE: If using email-based admin check:
-- CREATE POLICY "Admin all access" ON storage.objects
-- FOR ALL USING (
--     bucket_id = 'user-documents' AND
--     (SELECT email FROM auth.users WHERE id = auth.uid()) = 'zprizant@lightningledgerz.com'
-- );

-- 8. Grant permissions
GRANT ALL ON user_reports TO authenticated;
GRANT ALL ON user_documents TO authenticated;

-- 9. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_user_id ON user_reports(user_id);

-- Done! Your admin email is set to: zprizant@lightningledgerz.com
-- You can change this in the is_admin() function above
