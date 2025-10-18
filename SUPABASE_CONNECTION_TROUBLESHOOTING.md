# Supabase Connection Troubleshooting Guide

## Current Issue
The backend cannot connect to Supabase PostgreSQL database. All connection attempts are failing with DNS resolution errors.

## Diagnosed Problems

### 1. IPv4 Compatibility Issue
- Supabase shows "Not IPv4 compatible" warning
- Direct connection on port 5432 fails with DNS lookup errors
- Session Pooler required for IPv4 networks

### 2. DNS Resolution Failures
All hostname lookups are failing:
- `db.vjlozlmvvvhcyfdqepuz.supabase.co` → ENOTFOUND
- Session pooler hostnames also failing

## Immediate Solutions

### Option 1: Use Connection String from Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Find the "Connection string" section
4. Copy the **Session pooler** connection string (not the direct one)
5. Update the `.env` file with the exact values

### Option 2: Check Network Configuration
```bash
# Test DNS resolution
nslookup db.vjlozlmvvvhcyfdqepuz.supabase.co
ping db.vjlozlmvvvhcyfdqepuz.supabase.co

# Test with different DNS
dig @8.8.8.8 db.vjlozlmvvvhcyfdqepuz.supabase.co
```

### Option 3: Use Alternative Connection Methods

#### 3a. Connection String Format
Instead of individual environment variables, use a full connection string:
```javascript
const connectionString = 'postgresql://postgres.vjlozlmvvvhcyfdqepuz:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres';
```

#### 3b. Update postgres.js to use connection string
```javascript
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
```

## Next Steps

1. **Get the exact Session Pooler connection string** from your Supabase dashboard
2. **Verify your network can reach Supabase** by testing DNS resolution
3. **Update backend configuration** with working connection details
4. **Test connection** before proceeding with deployment

## Files to Update

- `/backend/.env` - Connection parameters
- `/backend/config/postgres.js` - Database configuration
- Test with `/backend/check-session-pooler.js`

## Connection Test Command
```bash
cd backend && node test-all-connections.js
```

## Expected Working Configuration
```env
PG_HOST=[SESSION_POOLER_HOST]
PG_PORT=6543
PG_DB=postgres
PG_USER=postgres.[PROJECT_REF]
PG_PASSWORD=[YOUR_PASSWORD]
```

Where:
- `[SESSION_POOLER_HOST]` = The pooler hostname from Supabase dashboard
- `[PROJECT_REF]` = Your project reference (vjlozlmvvvhcyfdqepuz)
- `[YOUR_PASSWORD]` = Your database password
