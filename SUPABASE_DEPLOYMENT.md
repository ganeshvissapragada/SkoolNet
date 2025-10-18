# 🚀 Supabase Database Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Supabase Project Setup
Before running the deployment script, ensure you have:

- [ ] **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
- [ ] **New Project Created**: Create a new project in Supabase dashboard
- [ ] **Project Reference**: Note your project reference (e.g., `abc123def456`)
- [ ] **Database Password**: Set and note your database password

### 2. Get Required Information
You'll need these details during deployment:

```bash
# Supabase Details (from your Supabase dashboard)
SUPABASE_REF=your-project-ref       # Found in Settings > General
SUPABASE_PASSWORD=your-db-password  # Set during project creation

# Frontend Domain (where your app will be hosted)
FRONTEND_DOMAIN=your-app.vercel.app
```

### 3. Database Connection String Format
Your Supabase PostgreSQL connection will be:
```
postgresql://postgres:YOUR-PASSWORD@db.YOUR-REF.supabase.co:5432/postgres
```

## 🚀 Deployment Process

### Step 1: Run Deployment Script
```bash
cd /Users/ganeshv/Downloads/schoolplatform
./scripts/deploy-supabase.sh
```

### Step 2: Follow Interactive Prompts
The script will ask for:
1. Supabase Project Reference
2. Database Password
3. Frontend Domain

### Step 3: Verification
The script automatically:
- ✅ Tests database connection
- ✅ Deploys schema (all tables)
- ✅ Seeds initial data
- ✅ Verifies deployment

## 📊 Expected Database Schema

After deployment, your Supabase database will contain:

### PostgreSQL Tables (Relational Data)
- **Users** - Authentication & user management
- **Students** - Student records
- **Classes** - Class information
- **Subjects** - Subject data
- **meal_plans** - Meal planning
- **inventory_items** - Inventory management
- **meal_consumption** - Consumption tracking
- **assignments** - Assignment system
- **assignment_submissions** - Student submissions
- **teacher_assignments** - Teacher-subject mappings
- **ptms** - Parent-teacher meetings
- **scholarships** - Scholarship management

### MongoDB Collections (Analytics)
- **attendances** - Attendance records
- **marks** - Grade/marks data
- **meal_feedback** - Feedback data

## 🔧 Post-Deployment Configuration

### 1. Render Backend Deployment
Update Render environment variables:
```bash
NODE_ENV=production
PG_HOST=db.YOUR-REF.supabase.co
PG_PASSWORD=YOUR-PASSWORD
MONGO_URI=mongodb+srv://mohankrishna:NZHMXnucP1d2NIqi@schooldb.7fnlndi.mongodb.net/
CLOUDINARY_CLOUD_NAME=dcgfcbqbv
CORS_ORIGIN=https://your-app.vercel.app
```

### 2. Vercel Frontend Deployment
Environment variables for Vercel:
```bash
VITE_API_URL=https://your-backend.render.com
```

## 🎯 Success Indicators

After successful deployment, you should see:
- ✅ Supabase dashboard shows all tables
- ✅ Test admin user created
- ✅ Sample students and classes seeded
- ✅ API endpoints responding
- ✅ Frontend connecting to backend

## 🔗 Quick Links

- **Supabase Dashboard**: [app.supabase.com](https://app.supabase.com)
- **Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

## 📞 Troubleshooting

### Common Issues:

1. **Connection Timeout**
   - Check Supabase project is active
   - Verify password and project ref

2. **SSL Connection Error**
   - Supabase requires SSL (handled in script)

3. **Permission Denied**
   - Check database password
   - Ensure project ref is correct

4. **Schema Deployment Failed**
   - Check PostgreSQL syntax
   - Review model definitions

### Debug Commands:
```bash
# Test connection manually
psql "postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"

# Check tables in Supabase
\dt

# Check specific table
SELECT * FROM "Users" LIMIT 5;
```

---

**Ready to deploy?** Run: `./scripts/deploy-supabase.sh`
