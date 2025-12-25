#!/bin/bash

echo "=== Manual Server Startup Script ==="
echo "This script will help you start both servers manually"

echo
echo "1. First, let's clean up any existing processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

echo "✅ Cleaned up existing processes"

echo
echo "2. Starting backend server..."
cd /Users/ganeshv/Downloads/schoolplatform/backend
node server.js &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

sleep 3

echo
echo "3. Testing backend server..."
if curl -s http://localhost:3001/api/landing-page-data > /dev/null; then
    echo "✅ Backend server is responding"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

echo
echo "4. Starting frontend server..."
cd /Users/ganeshv/Downloads/schoolplatform/frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo
echo "5. Servers are now running:"
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:5174"
echo
echo "To stop the servers, run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo
echo "Or use: pkill -f 'node server.js' && pkill -f 'vite'"
