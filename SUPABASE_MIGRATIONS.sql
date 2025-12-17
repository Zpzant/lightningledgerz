-- =====================================================
-- LIGHTNING LEDGERZ - SUPABASE DATABASE MIGRATIONS
-- =====================================================
-- Run these SQL queries in your Supabase SQL Editor

-- =====================================================
-- FILE UPLOADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS file_uploads (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    extracted_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);

-- Enable RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own files" ON file_uploads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON file_uploads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files" ON file_uploads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON file_uploads
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- USER AVATARS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_avatars (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
    avatar_data JSONB NOT NULL DEFAULT '{}',
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    experience INTEGER DEFAULT 0 CHECK (experience >= 0),
    currency INTEGER DEFAULT 0 CHECK (currency >= 0),
    inventory JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_user_avatars_user_id ON user_avatars(user_id);

-- Enable RLS
ALTER TABLE user_avatars ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own avatar" ON user_avatars
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own avatar" ON user_avatars
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatar" ON user_avatars
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- REFERRALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS referrals (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    referral_code TEXT NOT NULL UNIQUE,
    referral_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_referrals_user_id ON referrals(user_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own referral" ON referrals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create referral" ON referrals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- REFERRAL TRACKING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_tracking (
    id BIGSERIAL PRIMARY KEY,
    referrer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    reward_status TEXT DEFAULT 'pending' CHECK (reward_status IN ('pending', 'completed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_referral_tracking_referrer ON referral_tracking(referrer_id);
CREATE INDEX idx_referral_tracking_referred ON referral_tracking(referred_id);
CREATE INDEX idx_referral_tracking_status ON referral_tracking(reward_status);

-- Enable RLS
ALTER TABLE referral_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Referrer can view their referrals" ON referral_tracking
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can track referrals" ON referral_tracking
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "System can update rewards" ON referral_tracking
    FOR UPDATE USING (TRUE);

-- =====================================================
-- USER SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
    package_tier TEXT DEFAULT 'basic' CHECK (package_tier IN ('basic', 'premium', 'enterprise')),
    premium_expiry TIMESTAMP WITH TIME ZONE,
    bonus_credits INTEGER DEFAULT 0 CHECK (bonus_credits >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_expiry ON user_subscriptions(premium_expiry);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their subscription" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their subscription" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (TRUE);

-- =====================================================
-- PRESENTATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS presentations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    title TEXT NOT NULL,
    slides JSONB NOT NULL DEFAULT '[]',
    company_info JSONB,
    template_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_presentations_user_id ON presentations(user_id);
CREATE INDEX idx_presentations_created_at ON presentations(created_at);

-- Enable RLS
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their presentations" ON presentations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create presentations" ON presentations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their presentations" ON presentations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their presentations" ON presentations
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- UPDATE PROFILES TABLE (if needed)
-- =====================================================
-- Add avatar and company columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_logo TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- CREATE FUNCTIONS
-- =====================================================

-- Function to calculate avatar level based on experience
CREATE OR REPLACE FUNCTION calculate_avatar_level(experience INT)
RETURNS INT AS $$
BEGIN
    RETURN LEAST(
        1 + (experience / 100),
        100
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to award referral rewards
CREATE OR REPLACE FUNCTION award_referral_rewards(
    referrer_uuid UUID,
    referred_uuid UUID,
    reward_months INT
)
RETURNS BOOLEAN AS $$
DECLARE
    expiry_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate expiry date
    expiry_date := NOW() + (reward_months || ' months')::INTERVAL;

    -- Update or insert subscription for referrer
    INSERT INTO user_subscriptions (user_id, premium_expiry, bonus_credits)
    VALUES (referrer_uuid, expiry_date, 100)
    ON CONFLICT (user_id) DO UPDATE
    SET premium_expiry = GREATEST(user_subscriptions.premium_expiry, expiry_date),
        bonus_credits = bonus_credits + 100;

    -- Update or insert subscription for referred
    INSERT INTO user_subscriptions (user_id, premium_expiry, bonus_credits)
    VALUES (referred_uuid, NOW() + '1 month'::INTERVAL, 50)
    ON CONFLICT (user_id) DO UPDATE
    SET premium_expiry = GREATEST(user_subscriptions.premium_expiry, NOW() + '1 month'::INTERVAL),
        bonus_credits = bonus_credits + 50;

    -- Update referral tracking status
    UPDATE referral_tracking
    SET reward_status = 'completed',
        updated_at = NOW()
    WHERE referrer_id = referrer_uuid AND referred_id = referred_uuid;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

-- Trigger to create avatar on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_avatars (user_id, avatar_data, level, experience, currency)
    VALUES (
        NEW.id,
        '{"gender": "male", "skinTone": "medium", "eyeColor": "brown"}',
        1,
        0,
        0
    );

    INSERT INTO user_subscriptions (user_id, package_tier)
    VALUES (NEW.id, 'basic');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- STORAGE BUCKETS (if using Supabase Storage)
-- =====================================================
-- Create buckets for file storage
-- INSERT INTO storage.buckets (id, name, public) VALUES
-- ('avatars', 'avatars', true),
-- ('presentations', 'presentations', false),
-- ('company-logos', 'company-logos', false),
-- ('uploads', 'uploads', false);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View for referral statistics
CREATE OR REPLACE VIEW referral_stats AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT rt.referred_id) as referral_count,
    COUNT(DISTINCT CASE WHEN rt.reward_status = 'completed' THEN rt.referred_id END) as completed_referrals,
    COALESCE(us.bonus_credits, 0) as bonus_credits_earned
FROM auth.users u
LEFT JOIN referral_tracking rt ON u.id = rt.referrer_id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
GROUP BY u.id, u.email, us.bonus_credits;

-- View for active premium users
CREATE OR REPLACE VIEW active_premium_users AS
SELECT 
    u.id,
    u.email,
    us.package_tier,
    us.premium_expiry,
    CASE WHEN us.premium_expiry > NOW() THEN true ELSE false END as is_active
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
WHERE us.premium_expiry > NOW() OR us.package_tier = 'premium';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Allow authenticated users to execute functions
GRANT EXECUTE ON FUNCTION award_referral_rewards TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_avatar_level TO authenticated;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Run these migrations in order
-- 2. Ensure Row Level Security is enabled on all tables
-- 3. Test RLS policies before deploying to production
-- 4. Back up your database before running migrations
-- 5. Monitor storage usage for file uploads
-- 6. Set up automated cleanup for expired subscriptions
-- 7. Consider adding triggers for audit logging

-- =====================================================
-- OPTIONAL: SAMPLE DATA
-- =====================================================
-- Uncomment to add sample data (replace UUIDs with real user IDs)

-- INSERT INTO referrals (user_id, referral_code, referral_url)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'LL0000ABCD1234', 'https://yourdomain.com?ref=LL0000ABCD1234');

-- INSERT INTO presentations (user_id, title, template_type)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'Q4 Financial Report', 'financial_summary');
