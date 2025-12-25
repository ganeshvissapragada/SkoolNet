# Environment Variables Template for School Platform
# Copy these variables to your deployment platforms (Vercel, Render, GitHub Actions)

# ===========================================
# VERCEL ENVIRONMENT VARIABLES (Frontend)
# ===========================================
# Add these in Vercel Dashboard → Project Settings → Environment Variables

VITE_API_URL=https://your-backend-service.onrender.com
VITE_DEV_API_URL=http://localhost:3001
VITE_APP_NAME=School Platform
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name

# ===========================================
# RENDER ENVIRONMENT VARIABLES (Backend)
# ===========================================
# Add these in Render Dashboard → Your Service → Environment

API_URL=https://your-backend-service.onrender.com
DATABASE_URL=your-database-url
SUPABASE_URL=https://your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
CLOUDINARY_URL=your-cloudinary-url
JWT_SECRET=your-jwt-secret
REDIS_URL=your-redis-url

# ===========================================
# GITHUB ACTIONS SECRETS
# ===========================================
# Add these in GitHub → Your Repository → Settings → Secrets

API_URL: https://your-backend-service.onrender.com
DATABASE_URL: your-database-url
SUPABASE_URL: https://your-supabase-url
SUPABASE_ANON_KEY: your-supabase-anon-key
CLOUDINARY_URL: your-cloudinary-url
JWT_SECRET: your-jwt-secret
REDIS_URL: your-redis-url

# ===========================================
# LOCAL DEVELOPMENT VARIABLES
# ===========================================
# Rename this file to .env and add your local variables

VITE_API_URL=http://localhost:3001
VITE_APP_NAME=School Platform
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=true
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name

API_URL=http://localhost:3001
DATABASE_URL=your-local-database-url
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-supabase-anon-key
CLOUDINARY_URL=your-local-cloudinary-url
JWT_SECRET=your-local-jwt-secret
REDIS_URL=your-local-redis-url

# ===========================================
# DOCKER ENVIRONMENT VARIABLES
# ===========================================
# Add these in your Docker configuration

API_URL=https://your-backend-service.onrender.com
DATABASE_URL=your-database-url
SUPABASE_URL=https://your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
CLOUDINARY_URL=your-cloudinary-url
JWT_SECRET=your-jwt-secret
REDIS_URL=your-redis-url

# ===========================================
# DEPLOYMENT NOTES
# ===========================================
# - Ensure all URLs are accessible from the deployment platform.
# - Set up your database and storage services before deploying.
# - Review CORS settings in your backend service.

# 📚 Vercel Docs: https://vercel.com/docs
# 📚 Render Docs: https://render.com/docs
# 📚 Supabase Docs: https://supabase.com/docs
# 📚 MongoDB Atlas Docs: https://docs.atlas.mongodb.com
# 📚 Cloudinary Docs: https://cloudinary.com/documentation
# 📚 GitHub Actions Docs: https://docs.github.com/en/actions
