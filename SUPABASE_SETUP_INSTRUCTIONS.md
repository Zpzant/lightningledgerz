# Lightning Ledgerz - Supabase Setup Instructions

## Step 1: Run SQL Schema

1. Go to your Supabase project: https://uxicgilvxcqpoxavilxp.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the entire contents of `supabase-setup.sql`
5. Click **Run** to execute the SQL
6. You should see success messages for all tables and policies created

## Step 2: Create Storage Buckets

### 2.1 Create 'avatars' Bucket (Public)
1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `avatars`
4. Public bucket: **Yes** (check the box)
5. Click **Create bucket**

### 2.2 Create 'user-documents' Bucket (Private)
1. Click **New bucket**
2. Name: `user-documents`
3. Public bucket: **No** (leave unchecked)
4. Click **Create bucket**

### 2.3 Create 'powerpoint-files' Bucket (Private)
1. Click **New bucket**
2. Name: `powerpoint-files`
3. Public bucket: **No** (leave unchecked)
4. Click **Create bucket**

## Step 3: Configure Storage Policies

### 3.1 Avatars Bucket Policies

Click on the **avatars** bucket, go to **Policies**, and add these policies:

**Policy 1: Allow authenticated users to upload**
- Policy name: `Users can upload their own avatar`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 2: Allow authenticated users to update**
- Policy name: `Users can update their own avatar`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 3: Allow public read access**
- Policy name: `Anyone can view avatars`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression:
```sql
bucket_id = 'avatars'
```

### 3.2 User Documents Bucket Policies

Click on the **user-documents** bucket, go to **Policies**, and add:

**Policy 1: Users can upload their own documents**
- Policy name: `Users can upload own documents`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 2: Users can view their own documents**
- Policy name: `Users can view own documents`
- Allowed operation: `SELECT`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 3: Users can delete their own documents**
- Policy name: `Users can delete own documents`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 4: Admin can view all documents**
- Policy name: `Admin can view all documents`
- Allowed operation: `SELECT`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'user-documents' AND
EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
)
```

### 3.3 PowerPoint Files Bucket Policies

Click on the **powerpoint-files** bucket, go to **Policies**, and add:

**Policy 1: Gold/Diamond users can upload**
- Policy name: `Gold/Diamond users can upload powerpoint`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'powerpoint-files' AND
auth.uid()::text = (storage.foldername(name))[1] AND
EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND package_tier IN ('gold', 'diamond')
)
```

**Policy 2: Gold/Diamond users can view their own files**
- Policy name: `Gold/Diamond users can view own powerpoint`
- Allowed operation: `SELECT`
- Target roles: `authenticated`
- USING expression:
```sql
bucket_id = 'powerpoint-files' AND
auth.uid()::text = (storage.foldername(name))[1] AND
EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND package_tier IN ('gold', 'diamond')
)
```

## Step 4: Set Yourself as Admin

After you sign up with `zpzant@gmail.com`:

1. Go to **SQL Editor**
2. Run this query:
```sql
UPDATE public.profiles
SET is_admin = TRUE
WHERE email = 'zpzant@gmail.com';
```

## Step 5: IMPORTANT - Disable Email Confirmation for Testing

**This step is CRITICAL for the app to work properly during development!**

1. Go to **Authentication** in the left sidebar
2. Click on **Providers** (or **Email** under Auth Providers)
3. Click on **Email** provider
4. **TURN OFF** "Confirm email" toggle
5. Click **Save**

Without this step, users will need to confirm their email before they can sign in, which means:
- They won't be logged in automatically after signup
- Their profile won't be created
- They'll get an error when trying to sign in

### For Production (Later):
When you're ready for production, you can:
1. Re-enable email confirmation
2. Configure custom SMTP settings (go to **Project Settings** > **Auth** > **SMTP Settings**)
3. Customize email templates under **Authentication** > **Email Templates**

## Step 6: Configure Auth Settings

1. Go to **Authentication** > **Settings**
2. Site URL: Add your domain (or `http://localhost` for local testing)
3. Redirect URLs: Add your domain + `/auth/callback`

## Step 7: Test Your Setup

1. Open the new `index.html` file in a browser
2. Sign up with a test account
3. Check that the profile is created in the **profiles** table
4. Upload a file and check it appears in storage
5. Sign in with `zpzant@gmail.com` to verify admin access

## Troubleshooting

### If you get RLS errors:
- Make sure you ran the entire SQL script
- Check that RLS is enabled on all tables
- Verify policies are created correctly

### If storage upload fails:
- Check bucket policies are configured
- Verify bucket names match exactly: `avatars`, `user-documents`, `powerpoint-files`
- Ensure you're logged in when uploading

### If admin features don't work:
- Verify the admin flag is set: `SELECT * FROM profiles WHERE email = 'zpzant@gmail.com';`
- Make sure you're signed in with that account

## Ready to Use!

Once all steps are complete, your Supabase backend will be fully configured and ready for the Lightning Ledgerz application!

---

# Supabase CLI Setup (For VS Code Development)

## Step A: Install Supabase CLI

### On Windows (PowerShell as Administrator):
```powershell
# Using Scoop (recommended)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# OR using npm (if you have Node.js)
npm install -g supabase
```

### Verify installation:
```bash
supabase --version
```

## Step B: Login to Supabase CLI

1. Generate an access token:
   - Go to https://supabase.com/dashboard/account/tokens
   - Click **Generate new token**
   - Copy the token

2. Login via CLI:
```bash
supabase login
```
   - Paste your access token when prompted

## Step C: Link Your Project

1. Navigate to your project folder:
```bash
cd "c:\Users\zpzan\OneDrive\Desktop\lightningledgerz"
```

2. Initialize Supabase locally:
```bash
supabase init
```

3. Link to your existing project:
```bash
supabase link --project-ref uxicgilvxcqpoxavilxp
```
   - When prompted for database password, enter your Supabase database password
   - Find this in: Project Settings > Database > Connection string

## Step D: Common CLI Commands

### Pull remote schema to local:
```bash
supabase db pull
```

### Push local changes to remote:
```bash
supabase db push
```

### Generate TypeScript types from your schema:
```bash
supabase gen types typescript --linked > types/supabase.ts
```

### Run migrations:
```bash
supabase migration up
```

### Create a new migration:
```bash
supabase migration new add_session_history
```

### View database diff:
```bash
supabase db diff
```

## Step E: VS Code Integration

### Recommended Extensions:
1. **Supabase** - Official extension for Supabase
2. **PostgreSQL** - For SQL syntax highlighting
3. **SQL Formatter** - To format SQL files

### Configure settings.json:
Add to your VS Code settings:
```json
{
    "files.associations": {
        "*.sql": "sql"
    },
    "editor.formatOnSave": true
}
```

## Step F: Environment Variables

Create a `.env` file in your project root (add to .gitignore!):
```
SUPABASE_URL=https://uxicgilvxcqpoxavilxp.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Where to find your keys:
1. Go to https://supabase.com/dashboard/project/uxicgilvxcqpoxavilxp/settings/api
2. Copy **URL** for SUPABASE_URL
3. Copy **anon public** key for SUPABASE_ANON_KEY
4. Copy **service_role** key for SUPABASE_SERVICE_ROLE_KEY (keep secret!)

---

# Configure auth.js with Your Credentials

Update these lines in [auth.js](auth.js#L10-L11):

```javascript
const SUPABASE_URL = 'https://uxicgilvxcqpoxavilxp.supabase.co';
const SUPABASE_ANON_KEY = 'your_anon_key_here';  // Get from API settings
```

---

# New Session Tracking Feature

The auth system now tracks user sessions with these capabilities:

## Session History Table
- Tracks login sessions with device info, browser, OS
- Records last activity timestamp
- Stores session state (what page user was on)

## User Workspace Table
- Saves user preferences (theme, sidebar state)
- Remembers last visited section
- Persists dashboard filters and chart preferences

## API Functions Available:
```javascript
// Track page navigation
LightningAuth.updateSessionActivity('dashboard', 'viewed_charts');

// Load previous sessions
const sessions = await LightningAuth.loadSessionHistory();

// Save workspace state
await LightningAuth.saveWorkspaceState({
    theme: 'dark',
    sidebar_collapsed: false,
    last_visited_section: 'dashboard'
});

// Load workspace state
const workspace = await LightningAuth.loadWorkspaceState();
```

---

# Run the New Migration

If you already have the old tables, run this additional SQL in Supabase SQL Editor:

```sql
-- SESSION HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.session_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    session_token TEXT,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
    browser TEXT,
    os TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    session_data JSONB DEFAULT '{}'::jsonb,
    last_page TEXT,
    last_action TEXT
);

ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session history"
    ON public.session_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own session history"
    ON public.session_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own session history"
    ON public.session_history FOR UPDATE USING (auth.uid() = user_id);

-- USER WORKSPACE TABLE
CREATE TABLE IF NOT EXISTS public.user_workspace (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    active_dashboard_id UUID REFERENCES public.dashboard_data(id),
    active_document_id UUID REFERENCES public.user_documents(id),
    sidebar_collapsed BOOLEAN DEFAULT FALSE,
    theme TEXT DEFAULT 'dark',
    last_visited_section TEXT DEFAULT 'home',
    dashboard_filters JSONB DEFAULT '{}'::jsonb,
    chart_preferences JSONB DEFAULT '{}'::jsonb,
    notification_settings JSONB DEFAULT '{"email": true, "browser": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.user_workspace ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workspace"
    ON public.user_workspace FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workspace"
    ON public.user_workspace FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workspace"
    ON public.user_workspace FOR UPDATE USING (auth.uid() = user_id);
```

---

## Next Steps

The updated system now handles:
- ✅ User authentication with Supabase
- ✅ Avatar customization and storage
- ✅ File uploads with RLS
- ✅ Financial dashboard with real-time charts
- ✅ PowerPoint generation (Gold/Diamond)
- ✅ QuickBooks integration (Diamond)
- ✅ Admin dashboard for you to view all users
- ✅ **Session tracking and history**
- ✅ **Workspace state persistence**
- ✅ **User data isolation via RLS**
