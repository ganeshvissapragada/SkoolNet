# 🚀 Vercel Frontend Deployment Guide

## Step-by-Step Vercel Deployment

### 1. Access Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (preferably with GitHub account)
3. Click **"Add New"** → **"Project"**

### 2. Import Repository
1. Find your **schoolplatform** repository
2. Click **"Import"** next to it
3. If not visible, click **"Import Git Repository"** and paste URL

### 3. Configure Project Settings

#### Framework Detection:
- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `frontend` ⚠️ **CRITICAL: Must be "frontend"**

#### Build Settings:
- **Build Command**: `npm run build` (should auto-fill)
- **Output Directory**: `dist` (should auto-fill)
- **Install Command**: `npm install` (should auto-fill)

#### Environment Variables:
Click **"Environment Variables"** and add:
```
VITE_API_URL = https://skoolnet.onrender.com
```

### 4. Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build and deployment
3. Get your live URL: `https://YOUR-PROJECT-NAME.vercel.app`

## 📁 Files Created

### `frontend/vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist", 
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "VITE_API_URL": "https://skoolnet.onrender.com"
  }
}
```

## 🔧 Configuration Details

### Environment Variables for Vercel:
- **VITE_API_URL**: `https://skoolnet.onrender.com`

### Build Configuration:
- **Framework**: Vite
- **Node Version**: 18.x (default)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 📋 Deployment Checklist

### Before Deployment:
- ✅ Backend deployed and working at https://skoolnet.onrender.com
- ✅ Frontend API configuration updated
- ✅ vercel.json created
- ✅ Code pushed to GitHub

### During Deployment:
- ✅ Repository imported to Vercel
- ✅ Root directory set to `frontend`
- ✅ Environment variable `VITE_API_URL` added
- ✅ Framework preset set to Vite

### After Deployment:
- ✅ Frontend loads without errors
- ✅ API calls reach backend successfully
- ✅ Login/authentication works
- ✅ All dashboard features functional

## 🧪 Testing After Deployment

Once deployed, test these features:
1. **Landing Page**: Should load properly
2. **Login**: Should connect to backend API
3. **Admin Dashboard**: Should fetch data from backend
4. **API Integration**: Check browser console for any CORS errors

## 🌐 Expected Result

Your frontend will be live at:
```
https://YOUR-PROJECT-NAME.vercel.app
```

And it will communicate with your backend at:
```
https://skoolnet.onrender.com
```

## 🔧 Quick Commands Summary

### Vercel Dashboard Actions:
1. **New Project** → Import from GitHub
2. **Root Directory**: `frontend`
3. **Environment Variables**: Add `VITE_API_URL`
4. **Deploy** → Wait for build completion
5. **Visit**: Your live frontend URL

Your frontend will be live and fully connected to the backend! 🎯
