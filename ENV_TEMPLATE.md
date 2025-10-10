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
# Add these in Render Dashboard → Service Settings → Environment

NODE_ENV=production
PORT=3001

# Supabase PostgreSQL
PG_HOST=db.your-project-ref.supabase.co
PG_PORT=5432
PG_DB=postgres
PG_USER=postgres
PG_PASSWORD=your-supabase-password

# MongoDB Atlas (Optional)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school_platform

# Security
JWT_SECRET=your-super-secure-jwt-secret-here-minimum-32-characters

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS & File Upload
CORS_ORIGIN=https://your-frontend-domain.vercel.app
MAX_FILE_SIZE=10485760
MAX_FILES=10

# ===========================================
# GITHUB ACTIONS SECRETS
# ===========================================
# Add these in GitHub → Repository Settings → Secrets and Variables → Actions

# Vercel Integration
VERCEL_TOKEN=your-vercel-token-from-account-settings
VERCEL_ORG_ID=your-vercel-org-id-from-project-settings
VERCEL_PROJECT_ID=your-vercel-project-id-from-project-settings

# Render Integration
RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx?key=xxxxx

# Environment Variables for Build Process
VITE_API_URL=https://your-backend-service.onrender.com

# ===========================================
# HOW TO GET THESE VALUES
# ===========================================

# SUPABASE VALUES:
# 1. Go to https://supabase.com/dashboard
# 2. Create or select your project
# 3. Go to Settings → Database
# 4. Find Connection Parameters
# 5. Use Connection Pooling settings for production

# MONGODB ATLAS VALUES:
# 1. Go to https://cloud.mongodb.com
# 2. Create cluster if you haven't
# 3. Click "Connect" → "Connect your application"
# 4. Copy the connection string
# 5. Replace <password> and <dbname>

# CLOUDINARY VALUES:
# 1. Go to https://cloudinary.com/console
# 2. Dashboard shows Cloud name, API Key, API Secret

# VERCEL VALUES:
# 1. Vercel Token: Account Settings → Tokens → Create Token
# 2. Org ID & Project ID: Project Settings → General (scroll down)

# RENDER VALUES:
# 1. Go to your Render service
# 2. Settings → Deploy Hook → Create Deploy Hook

# JWT SECRET:
# Generate a strong secret (minimum 32 characters):
# You can use: openssl rand -base64 32
# Or online generator: https://randomkeygen.com/

# ===========================================
# VERIFICATION CHECKLIST
# ===========================================

# ✅ Supabase project created and accessible
# ✅ MongoDB Atlas cluster created (if using MongoDB)
# ✅ Cloudinary account set up
# ✅ Vercel project connected to GitHub
# ✅ Render service created with GitHub auto-deploy
# ✅ All environment variables added to respective platforms
# ✅ GitHub Actions secrets configured
# ✅ Configuration files updated with actual URLs
# ✅ Initial deployment completed successfully
# ✅ Health endpoint responding (/health)
# ✅ API endpoints accessible
# ✅ Frontend loading correctly
# ✅ Database connections working
# ✅ File upload to Cloudinary working

# ===========================================
# SECURITY NOTES
# ===========================================

# 🔒 NEVER commit actual secrets to your repository
# 🔒 Use different secrets for staging and production
# 🔒 Regularly rotate your JWT secrets
# 🔒 Enable 2FA on all service accounts
# 🔒 Monitor your service usage and billing
# 🔒 Set up IP restrictions where possible
# 🔒 Use strong, unique passwords for all services

# ===========================================
# SUPPORT RESOURCES
# ===========================================

# 📚 Vercel Docs: https://vercel.com/docs
# 📚 Render Docs: https://render.com/docs
# 📚 Supabase Docs: https://supabase.com/docs
# 📚 MongoDB Atlas Docs: https://docs.atlas.mongodb.com
# 📚 Cloudinary Docs: https://cloudinary.com/documentation
# 📚 GitHub Actions Docs: https://docs.github.com/en/actions
