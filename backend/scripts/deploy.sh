#!/bin/bash

# Render Deployment Script
echo "🚀 Starting Render deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Run database migrations/seeding if needed
echo "🗃️ Setting up database..."
if [ "$NODE_ENV" = "production" ]; then
    echo "Production mode: Seeding database..."
    npm run seed || echo "Seeding completed with warnings"
fi

# Start the application
echo "🎯 Starting application..."
npm start
