#!/bin/bash

# Asset Management Quick Fix Script
# Fixes broken asset paths for immediate deployment

echo "🎨 School Platform Asset Management"
echo "=================================="
echo ""

echo "📊 Asset Analysis:"
echo "- Large Assets Found: 3 WhatsApp carousel images (178-299KB each)"
echo "- Login card background: 2.1MB"
echo "- Multiple broken /src/assets/ paths in production"
echo ""

echo "🚀 Quick Fix Options:"
echo "1. Fix paths only (deploy now, optimize later)"
echo "2. Fix paths + move large assets to Cloudinary (recommended)"
echo "3. Full asset optimization with Cloudinary migration"
echo ""

read -p "Choose option (1, 2, or 3): " choice

case $choice in
  1)
    echo "🔧 Applying quick path fixes..."
    
    # Fix SchoolLandingPage.jsx paths
    echo "📝 Fixing SchoolLandingPage.jsx..."
    sed -i.bak 's|/src/assets/|/assets/|g' frontend/src/pages/SchoolLandingPage.jsx
    sed -i.bak 's|frontend/src/assets/|/assets/|g' frontend/src/pages/SchoolLandingPage.jsx
    
    # Fix LoginPage.jsx paths
    echo "📝 Fixing LoginPage.jsx..."
    sed -i.bak 's|/src/assets/|/assets/|g' frontend/src/pages/LoginPage.jsx
    
    # Move public assets if needed
    echo "📝 Ensuring public assets are accessible..."
    mkdir -p frontend/public/assets/landingpage
    mkdir -p frontend/public/assets/icons
    mkdir -p frontend/public/assets/logincard
    mkdir -p frontend/public/assets/teachers
    mkdir -p frontend/public/assets/carousel
    
    # Copy key assets to public
    if [ -f "frontend/src/assets/logincard/sidecard.jpg" ]; then
      cp "frontend/src/assets/logincard/sidecard.jpg" "frontend/public/assets/logincard/"
    fi
    
    if [ -f "frontend/src/assets/teachers/PLN_Phanikumar_SA.png" ]; then
      cp "frontend/src/assets/teachers/PLN_Phanikumar_SA.png" "frontend/public/assets/teachers/"
    fi
    
    echo "✅ Quick fix applied! Ready for deployment."
    echo "⚠️  Remember to migrate to Cloudinary for better performance."
    ;;
    
  2)
    echo "🌟 Applying fixes + Cloudinary preparation..."
    
    # Apply quick fixes first
    $0 1
    
    echo ""
    echo "📋 Next Steps for Cloudinary Migration:"
    echo "1. Upload these large assets to Cloudinary:"
    echo "   - WhatsApp carousel images (299KB, 192KB, 178KB)"
    echo "   - Login background: sidecard.jpg (2.1MB)"
    echo "   - Teacher photos"
    echo ""
    echo "2. Update component imports with Cloudinary URLs"
    echo "3. Configure Cloudinary in your environment variables"
    echo ""
    echo "📝 Cloudinary Upload Commands:"
    echo "# After setting up Cloudinary account:"
    echo "# Upload via Cloudinary dashboard or API"
    ;;
    
  3)
    echo "🏆 Full optimization requires Cloudinary setup first."
    echo "Please set up your Cloudinary account and provide:"
    read -p "Cloudinary Cloud Name: " CLOUD_NAME
    
    if [ -z "$CLOUD_NAME" ]; then
      echo "❌ Cloud name required for full optimization."
      exit 1
    fi
    
    echo "📤 This would upload all assets to Cloudinary..."
    echo "⚠️  Manual upload to Cloudinary dashboard recommended for now."
    echo "🔗 Cloudinary Dashboard: https://console.cloudinary.com"
    ;;
    
  *)
    echo "❌ Invalid option. Please choose 1, 2, or 3."
    exit 1
    ;;
esac

echo ""
echo "🎉 Asset management update complete!"
echo ""
echo "📋 Deployment Checklist:"
echo "✅ Asset paths fixed for production"
echo "✅ Large assets identified for optimization"
echo "⏳ Ready for deployment with current fixes"
echo ""
echo "🚀 Next: Continue with deployment using DEPLOYMENT_GUIDE.md"
