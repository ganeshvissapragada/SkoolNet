# 🔧 Getting Your Supabase Connection Details

## Step 1: Go to Your Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your school platform project
3. Go to **Settings** → **Database**

## Step 2: Find Your Connection Details
Look for the "Connection parameters" or "Connection pooling" section:

```
Host: db.YOUR-PROJECT-REF.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [your password]
```

## Step 3: Update Your .env File
Replace the current values in `/Users/ganeshv/Downloads/schoolplatform/backend/.env`:

```bash
# Current (NOT WORKING):
PG_HOST=db.vjlozlmvvvhcyfdqepuz.supabase.co

# Update to (REPLACE WITH YOUR ACTUAL VALUES):
PG_HOST=db.YOUR-ACTUAL-PROJECT-REF.supabase.co
PG_PASSWORD=YOUR-ACTUAL-PASSWORD
```

## Step 4: Test Connection
Once updated, run:
```bash
cd /Users/ganeshv/Downloads/schoolplatform/backend
node test-direct-connection.js
```

---

## Alternative: Use Connection String
If you have a full connection string from Supabase, it looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Extract the parts:
- Host: `db.[YOUR-PROJECT-REF].supabase.co`
- Password: `[YOUR-PASSWORD]`
- Database: `postgres`
- User: `postgres`
- Port: `5432`

## Need Help?
If you're having trouble finding these details, please:
1. Share a screenshot of your Supabase dashboard → Settings → Database page
2. Or share the connection string (hide the password)
