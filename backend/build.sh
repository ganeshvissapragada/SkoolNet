#!/bin/bash

# Render Build Script for School Platform Backend
echo "🚀 Starting Render deployment build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run any database migrations or setup if needed
echo "🗄️ Setting up database..."
# npm run migrate # Uncomment if you have migrations

# Seed initial data (admin user)
echo "🌱 Seeding initial data..."
npm run seed || echo "⚠️ Seeding failed - this is expected on subsequent deployments"

echo "✅ Build complete! Server ready to start."
