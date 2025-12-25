#!/bin/bash

echo "=== School Platform Diagnosis ==="
echo

echo "1. Checking if backend server is running on port 3001..."
if curl -s http://localhost:3001/api/landing-page-data > /dev/null; then
    echo "✅ Backend server is running and responding"
    echo "Backend response:"
    curl -s http://localhost:3001/api/landing-page-data | head -n 5
else
    echo "❌ Backend server is not responding"
fi

echo
echo "2. Checking if frontend server is running on port 5174..."
if curl -s http://localhost:5174 > /dev/null; then
    echo "✅ Frontend server is running"
else
    echo "❌ Frontend server is not responding"
fi

echo
echo "3. Checking for running processes..."
echo "Node processes:"
ps aux | grep -E "(node|npm)" | grep -v grep

echo
echo "4. Checking port usage..."
echo "Port 3001:"
lsof -i :3001
echo "Port 5174:"
lsof -i :5174

echo
echo "5. Test backend data store..."
if [ -f "/Users/ganeshv/Downloads/schoolplatform/backend/controllers/landingPageDataStore.js" ]; then
    echo "✅ Landing page data store exists"
else
    echo "❌ Landing page data store missing"
fi
