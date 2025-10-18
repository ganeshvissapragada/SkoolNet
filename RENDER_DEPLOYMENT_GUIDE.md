# 🚀 Render Deployment Guide - School Platform Backend

## What You Need to Do in Render Dashboard

### Step 1: Access Render
1. Go to [render.com](https://render.com)
2. Sign up or log in (preferably with GitHub account)
3. Click **"New +"** button
4. Select **"Web Service"**

### Step 2: Connect Repository  
1. Choose **"Build and deploy from a Git repository"**
2. Connect your GitHub account if needed
3. Select your **schoolplatform** repository
4. Click **"Connect"**

### Step 3: Configure Service Settings
**Service Details:**
- **Name**: `schoolplatform-backend`
- **Region**: Choose closest region (e.g., Oregon, Singapore)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **CRITICAL: Must be "backend"**
- **Runtime**: `Node`

**Build Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables
Click **"Add Environment Variable"** and add these exact variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres.vjlozlmvvvhcyfdqepuz:f*L8QHa9V7u5dyN@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
MONGO_URI=mongodb+srv://mohankrishna:NZHMXnucP1d2NIqi@schooldb.7fnlndi.mongodb.net/?retryWrites=true&w=majority&appName=schooldb
JWT_SECRET=73b17c271d2459de44b436713ca47f05
CLOUDINARY_CLOUD_NAME=dcgfcbqbv
CLOUDINARY_API_KEY=144321214898354
CLOUDINARY_API_SECRET=LGiYlS0a38scylgrNTQ6IKl21bw
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Watch build logs for any errors
3. Wait 3-5 minutes for first deployment
4. Service will show "Live" when ready

## Deployment Steps

### Step 1: Prepare Repository
Make sure your code is committed to a Git repository (GitHub, GitLab, etc.):

```bash
cd /Users/ganeshv/Downloads/schoolplatform
git init
git add .
git commit -m "Initial commit - School Platform Backend"

# Push to GitHub (create repository first)
git remote add origin https://github.com/YOUR_USERNAME/school-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository

### Step 3: Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Select the `backend` folder as root directory
4. Configure the following:

#### Basic Settings
- **Name**: `school-platform-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend` (important!)

#### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Advanced Settings
- **Auto-Deploy**: Yes (recommended)
- **Health Check Path**: `/health`

### Step 4: Environment Variables
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres.vjlozlmvvvhcyfdqepuz:f*L8QHa9V7u5dyN@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
MONGO_URI=mongodb+srv://mohankrishna:NZHMXnucP1d2NIqi@schooldb.7fnlndi.mongodb.net/?retryWrites=true&w=majority&appName=schooldb
JWT_SECRET=your-super-secret-jwt-key-for-production
```

#### Optional (Cloudinary for file uploads)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for build and deployment (5-10 minutes)
3. Monitor logs for any errors

## Expected Deployment URL
Your backend will be available at:
```
https://school-platform-backend.onrender.com
```

## Test Deployment

### Health Check
```bash
curl https://school-platform-backend.onrender.com/health
```
Should return:
```json
{"status":"OK","timestamp":"2024-01-01T12:00:00.000Z"}
```

### API Endpoints
```bash
# Test auth endpoint
curl https://school-platform-backend.onrender.com/auth/check

# Test admin endpoint (if public)
curl https://school-platform-backend.onrender.com/admin/stats
```

## Files Ready for Render ✅

- ✅ **`Dockerfile`** - Container configuration
- ✅ **`package.json`** - Dependencies and scripts
- ✅ **`build.sh`** - Build script (if needed)
- ✅ **`render.yaml`** - Configuration reference
- ✅ **Server configured** - Production-ready server.js

## Post-Deployment Tasks

### 1. Update Frontend API URL
Once backend is deployed, update frontend to use the Render URL:

```javascript
// In frontend/src/api/api.js
const API_URL = 'https://school-platform-backend.onrender.com';
```

### 2. Test Database Operations
Verify that all CRUD operations work:
- User authentication
- Admin dashboard functions
- Teacher assignments
- Student/Parent operations

### 3. Monitor Logs
Check Render dashboard logs for:
- Successful database connections
- API request handling
- Any errors or warnings

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Review build logs in Render dashboard

#### 2. Database Connection Issues
- Verify DATABASE_URL environment variable
- Check Supabase connection limits
- Test connection string format

#### 3. Environment Variables
- Ensure all required env vars are set
- Check for typos in variable names
- Verify sensitive data is properly escaped

#### 4. Port Configuration
- Render uses PORT=10000 by default
- Ensure server.js uses `process.env.PORT`
- Health check should use correct port

### Render-Specific Notes

#### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down may be slow (cold start)
- 750 hours/month free usage

#### Upgrade Benefits
- Faster builds and deployments  
- No cold starts
- Custom domains
- More resources

## Success Checklist ✅

- [ ] Repository pushed to GitHub
- [ ] Render service created and configured
- [ ] Environment variables set correctly
- [ ] Build completes successfully
- [ ] Health check returns 200 OK
- [ ] Database connections established
- [ ] API endpoints respond correctly
- [ ] Frontend updated with new backend URL

## Next Steps
Once backend is deployed successfully:
1. Deploy frontend to Render/Vercel/Netlify
2. Update CORS settings for frontend domain
3. Configure custom domain (optional)
4. Set up monitoring and alerts
5. Implement CI/CD pipeline (optional)

Your School Platform Backend will be live and ready for production use! 🎉
