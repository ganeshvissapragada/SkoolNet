# Supabase Connection Fix Guide

## 🚨 Issue Identified
The hostname `db.vjlozlmvvvhcyfdqepuz.supabase.co` **does not exist** (DNS lookup failed).

## 🔧 How to Fix

### Step 1: Get Correct Connection Details
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Look for **Connection parameters** section

### Step 2: Copy the Correct Values
You'll see something like:
```
Host: db.abcdefghijklmnop.supabase.co
Database: postgres
Port: 5432
User: postgres
```

### Step 3: Update Your .env File
Replace the current values in `/backend/.env` with the correct ones:

```env
# OLD (Not Working)
PG_HOST=db.vjlozlmvvvhcyfdqepuz.supabase.co

# NEW (Copy from Supabase Dashboard)
PG_HOST=db.YOUR_ACTUAL_PROJECT_REF.supabase.co
```

### Step 4: Alternative - Try Connection Pooling
If the direct connection doesn't work, try the pooled connection:
```env
PG_HOST=db.YOUR_PROJECT_REF.supabase.co
PG_PORT=6543  # <- Note: Different port for pooling
```

## 🔍 Common Project Reference Formats
- `db.abcdefghijklmnop.supabase.co` (most common)
- `aws-0-us-east-1.pooler.supabase.com` (for pooling)

## ⚠️ Check These Issues
1. **Project Status**: Is your Supabase project active? (Check dashboard)
2. **Billing**: Free tier projects can be paused after inactivity
3. **IP Restrictions**: Check Settings → Authentication → Network restrictions

## 🧪 Test After Update
Once you update the .env file, test the connection:
```bash
cd backend
node check-db-status.js
```

## 📧 What You Need to Do Right Now
**Please go to your Supabase dashboard and copy the exact connection details from Settings → Database. The project reference `vjlozlmvvvhcyfdqepuz` appears to be incorrect or the project might be inactive.**
