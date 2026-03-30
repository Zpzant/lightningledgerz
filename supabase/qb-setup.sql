-- QuickBooks connections table (per-user, isolated)
CREATE TABLE IF NOT EXISTS qb_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  realm_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ,
  refresh_token_expiry TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row-level security: users can only see their own connection
ALTER TABLE qb_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own QB connection"
  ON qb_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QB connection"
  ON qb_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QB connection"
  ON qb_connections FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access"
  ON qb_connections FOR ALL
  USING (auth.role() = 'service_role');

-- Add QB fields to profiles if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS qb_connected BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS qb_realm_id TEXT;
