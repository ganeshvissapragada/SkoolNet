#!/bin/bash

echo "🔍 Pre-Deployment Verification for Render"
echo "========================================"

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

echo ""
echo "📦 Checking package.json..."
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
    
    # Check for required scripts
    if grep -q '"start".*"node server.js"' package.json; then
        echo "✅ Start script configured"
    else
        echo "❌ Start script missing or incorrect"
    fi
    
    if grep -q '"engines"' package.json; then
        echo "✅ Node.js engine specified"
    else
        echo "⚠️ Node.js engine version not specified"
    fi
else
    echo "❌ package.json not found"
fi

echo ""
echo "🐳 Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
    echo "✅ Dockerfile exists"
else
    echo "❌ Dockerfile missing"
fi

echo ""
echo "🗄️ Checking database configuration..."
if [ -f "config/postgres.js" ]; then
    echo "✅ PostgreSQL config exists"
else
    echo "❌ PostgreSQL config missing"
fi

echo ""
echo "🔧 Checking environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file exists (for local development)"
    
    if grep -q "DATABASE_URL" .env; then
        echo "✅ DATABASE_URL configured"
    else
        echo "❌ DATABASE_URL not found in .env"
    fi
    
    if grep -q "JWT_SECRET" .env; then
        echo "✅ JWT_SECRET configured"
    else
        echo "❌ JWT_SECRET not found in .env"
    fi
else
    echo "❌ .env file not found"
fi

echo ""
echo "🚀 Testing local server startup..."
echo "Starting server for 10 seconds to test..."

# Start server in background
npm start &
SERVER_PID=$!

# Wait a bit for server to start
sleep 5

# Test health endpoint
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Server starts successfully"
    echo "✅ Health endpoint responds"
else
    echo "❌ Server startup failed or health endpoint not responding"
fi

# Stop the server
kill $SERVER_PID 2>/dev/null

echo ""
echo "📋 Pre-deployment checklist:"
echo "- [ ] Code committed to Git repository"
echo "- [ ] Repository pushed to GitHub/GitLab"
echo "- [ ] Render account created"
echo "- [ ] Environment variables prepared for Render"
echo ""
echo "🎯 Ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push code to GitHub"
echo "2. Create new Web Service on Render"
echo "3. Set environment variables in Render dashboard"
echo "4. Deploy and monitor logs"
