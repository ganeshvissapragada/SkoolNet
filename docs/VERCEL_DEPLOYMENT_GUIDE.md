# 🚀 Vercel Frontend Deployment Guide

## Step-by-Step Vercel Deployment

### 1. Access Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (preferably with GitHub account)
3. Click **"Add New"** → **"Project"**

### 2. Import Project
1. Select the **GitHub repository** containing your frontend code.
2. Vercel will automatically detect the framework you are using.
3. Configure the project settings if necessary (usually, the defaults are fine).

### 3. Set Up Build & Development Settings
1. For the **Root Directory**, specify the path to your frontend code (e.g., `frontend`).
2. Set the **Build Command** to `npm run build` or `yarn build`.
3. Set the **Output Directory** to `build` or `dist`, depending on your framework.

### 4. Environment Variables
1. Add any necessary environment variables under the **"Environment Variables"** section.
2. Ensure that all required variables for your frontend to connect to the backend are included.

### 5. Deploy
1. Click the **"Deploy"** button.
2. Wait for Vercel to build and deploy your project.
3. Once completed, you will receive a live URL for your deployed frontend.

### 6. Connect to Backend
1. Ensure your backend is deployed and accessible via a public URL.
2. Update any necessary configuration in your frontend to point to the live backend URL.

### 7. Verify Deployment
1. Visit the provided live URL.
2. Test the application to ensure the frontend and backend are communicating correctly.

Your frontend will be live and fully connected to the backend! 🏁
