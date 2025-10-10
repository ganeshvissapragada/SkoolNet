# School Platform Deployment Guide 🚀

This guide will walk you through deploying the School Platform using our complete cloud-based infrastructure.

## 📋 Prerequisites

Before starting, ensure you have accounts and access to:
- [GitHub](https://github.com) (for code repository and CI/CD)
- [Vercel](https://vercel.com) (for frontend hosting)
- [Render](https://render.com) (for backend hosting)
- [Supabase](https://supabase.com) (for PostgreSQL database)
- [MongoDB Atlas](https://cloud.mongodb.com) (for MongoDB - optional)
- [Cloudinary](https://cloudinary.com) (for media storage)

## 🏗️ Architecture Overview

```
Frontend (React/Vite) → Vercel
     ↓ API calls
Backend (Node.js/Express) → Render
     ↓ Database connections
PostgreSQL → Supabase
MongoDB → MongoDB Atlas (optional)
Media Storage → Cloudinary
CI/CD → GitHub Actions
```

## 📂 Deployment Files Ready

All deployment configuration files are already created:
- ✅ `vercel.json` - Vercel frontend configuration
- ✅ `backend/Dockerfile` - Docker configuration for Render
- ✅ `backend/healthcheck.js` - Health check for Docker
- ✅ `.github/workflows/deploy.yml` - CI/CD pipeline
- ✅ `frontend/.env.production` - Frontend environment variables
- ✅ `backend/.env.production` - Backend environment variables

## 🎨 Asset Management Strategy

Your platform uses a **hybrid asset approach**:

### **Small Icons & UI Elements** → Bundled with app (src/assets/)
- Dashboard icons, navigation elements
- Automatically optimized by Vite
- Fast loading with cache busting

### **Large Images & Media** → Cloudinary CDN (recommended)
- Carousel images (178-299KB each)
- Login background (2.1MB)
- Teacher photos, event galleries
- Better performance with global CDN

### **Quick Asset Fix** (Required before deployment)
```bash
# Run this to fix asset paths for production:
./scripts/fix-assets.sh
```

**⚠️ Important**: Some asset paths need fixing for production deployment. Run the asset fix script before deploying.

## 🚀 Step-by-Step Deployment

### 0. Fix Asset Paths (Required First!)

**Before deploying**, fix asset paths for production:

```bash
# Fix asset paths for production deployment
./scripts/fix-assets.sh

# Choose option 1 for quick fix, or option 2 for Cloudinary preparation
```

**Why this is needed**: Some assets use `/src/assets/` paths that won't work in production.

### 1. Set Up Supabase (PostgreSQL Database)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your project details:
   - Project URL: `https://[your-project-ref].supabase.co`
   - Database password (you set this during setup)
   - API Key (from Settings → API)

### 2. Set Up MongoDB Atlas (Optional)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/school_platform`

### 3. Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Create an account and note:
   - Cloud name
   - API Key
   - API Secret

### 4. Deploy Backend to Render

1. Go to [Render](https://render.com) and connect your GitHub account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Docker**: Enable (will use our Dockerfile)

5. Add Environment Variables in Render:
   ```
   NODE_ENV=production
   PORT=3001
   PG_HOST=db.[your-project-ref].supabase.co
   PG_PORT=5432
   PG_DB=postgres
   PG_USER=postgres
   PG_PASSWORD=[your-supabase-password]
   MONGO_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/school_platform
   JWT_SECRET=[generate-a-strong-secret]
   CLOUDINARY_CLOUD_NAME=[your-cloud-name]
   CLOUDINARY_API_KEY=[your-api-key]
   CLOUDINARY_API_SECRET=[your-api-secret]
   CORS_ORIGIN=https://[your-frontend-domain].vercel.app
   MAX_FILE_SIZE=10485760
   MAX_FILES=10
   ```

6. Deploy and note your backend URL: `https://[your-service].onrender.com`

### 5. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and import your GitHub repository
2. Configure the project:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. Add Environment Variables in Vercel:
   ```
   VITE_API_URL=https://[your-backend-service].onrender.com
   VITE_APP_NAME=School Platform
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_DEBUG=false
   VITE_CLOUDINARY_CLOUD_NAME=[your-cloudinary-cloud-name]
   ```

4. Update the `vercel.json` file with your actual backend URL:

### 6. Set Up GitHub Actions CI/CD

1. In your GitHub repository, go to Settings → Secrets and Variables → Actions
2. Add the following secrets:

   **Vercel Secrets:**
   ```
   VERCEL_TOKEN=[from Vercel Settings → Tokens]
   VERCEL_ORG_ID=[from Vercel project settings]
   VERCEL_PROJECT_ID=[from Vercel project settings]
   ```

   **Render Secrets:**
   ```
   RENDER_DEPLOY_HOOK=[from Render service settings → Deploy Hook]
   ```

   **Environment Variables:**
   ```
   VITE_API_URL=https://[your-backend-service].onrender.com
   ```

### 7. Update Configuration Files

Update the placeholder URLs in your configuration files:

1. **Update `vercel.json`**:
   ```json
   "rewrites": [
     {
       "source": "/api/(.*)",
       "destination": "https://[your-actual-backend-url].onrender.com/api/$1"
     }
   ]
   ```

2. **Update environment files** with your actual service URLs and credentials.

### 8. Deploy and Test

1. **Push to GitHub**: Commit all changes and push to your main branch
2. **Monitor GitHub Actions**: Check the Actions tab to see your deployment pipeline
3. **Test the application**: 
   - Frontend: `https://[your-project].vercel.app`
   - Backend: `https://[your-service].onrender.com/health`

## 🔧 Post-Deployment Setup

### Initialize Database

After successful deployment, you'll need to initialize your database:

1. **Run database migrations** (if needed)
2. **Seed initial data** using the provided scripts:
   ```bash
   # You can run these via Render's console or create API endpoints
   npm run seed                    # Creates admin user
   npm run seed-students-parents   # Seeds sample data
   npm run seed-meals             # Seeds meal data
   ```

### Verify Deployment

Check these endpoints to ensure everything is working:

1. **Frontend**: `https://[your-project].vercel.app`
2. **Backend Health**: `https://[your-service].onrender.com/health`
3. **API**: `https://[your-service].onrender.com/api/public/stats`

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `CORS_ORIGIN` in backend matches your Vercel URL
2. **Database Connection**: Verify Supabase credentials and IP whitelist
3. **Build Failures**: Check GitHub Actions logs for specific error messages
4. **Environment Variables**: Ensure all required variables are set in both Vercel and Render

### Debugging Commands:

```bash
# Check backend logs
# In Render dashboard → Your service → Logs

# Check frontend build
cd frontend && npm run build

# Test backend locally with production env
cd backend && npm start
```

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** (Render provides basic monitoring)
2. **Configure custom domain** (optional)
3. **Set up SSL certificates** (automatically handled by Vercel and Render)
4. **Implement backup strategy** for databases
5. **Set up staging environment** for testing

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review Render and Vercel deployment logs
3. Verify all environment variables are correctly set
4. Test database connections using provided health endpoints

---

**🎉 Congratulations!** Your School Platform is now deployed and ready for use!
