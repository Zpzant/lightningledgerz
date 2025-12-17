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

## Next Steps

The updated HTML file will handle:
- ✅ User authentication with Supabase
- ✅ Avatar customization and storage
- ✅ File uploads with RLS
- ✅ Financial dashboard with real-time charts
- ✅ PowerPoint generation (Gold/Diamond)
- ✅ QuickBooks integration (Diamond)
- ✅ Admin dashboard for you to view all users
