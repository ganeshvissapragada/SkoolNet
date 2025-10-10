#!/bin/bash

# School Platform Deployment Configuration Script
# This script helps update configuration files with actual deployment URLs

echo "🚀 School Platform Deployment Configuration"
echo "==========================================="
echo ""

# Get backend URL
echo "📝 Please provide your deployment URLs:"
read -p "Enter your Render backend URL (e.g., https://school-platform-backend.onrender.com): " BACKEND_URL
read -p "Enter your Vercel frontend URL (e.g., https://school-platform.vercel.app): " FRONTEND_URL

# Validate URLs
if [[ ! "$BACKEND_URL" =~ ^https:// ]]; then
    echo "❌ Backend URL must start with https://"
    exit 1
fi

if [[ ! "$FRONTEND_URL" =~ ^https:// ]]; then
    echo "❌ Frontend URL must start with https://"
    exit 1
fi

echo ""
echo "🔄 Updating configuration files..."

# Update vercel.json
echo "📝 Updating vercel.json..."
sed -i.bak "s|https://your-backend-url.onrender.com|$BACKEND_URL|g" vercel.json

# Update frontend .env.production
echo "📝 Updating frontend/.env.production..."
sed -i.bak "s|https://your-backend-service.onrender.com|$BACKEND_URL|g" frontend/.env.production

# Update backend .env.production
echo "📝 Updating backend/.env.production..."
sed -i.bak "s|https://your-frontend-domain.vercel.app|$FRONTEND_URL|g" backend/.env.production

echo ""
echo "✅ Configuration files updated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your environment variables in Vercel and Render with actual values"
echo "2. Commit and push these changes to GitHub"
echo "3. Monitor the GitHub Actions deployment"
echo ""
echo "🔗 Quick links:"
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo "Health:   $BACKEND_URL/health"
echo ""
echo "🎉 Happy deploying!"
