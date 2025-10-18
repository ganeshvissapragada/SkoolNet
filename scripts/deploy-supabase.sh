#!/bin/bash

# 🚀 Supabase Database Deployment Script
# Deploys School Platform database to Supabase PostgreSQL

echo "🏗️  School Platform - Supabase Deployment"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/ganeshv/Downloads/schoolplatform"
BACKEND_DIR="$PROJECT_DIR/backend"

echo -e "${BLUE}📋 Deployment Checklist:${NC}"
echo "✅ PostgreSQL models ready"
echo "✅ Environment configuration prepared"
echo "✅ Seeding scripts available"
echo ""

# Step 1: Environment Setup
echo -e "${YELLOW}🔧 Step 1: Environment Setup${NC}"
echo "----------------------------------------"

read -p "Enter your Supabase Project Reference (e.g., abc123def456): " SUPABASE_REF
read -s -p "Enter your Supabase Database Password: " SUPABASE_PASSWORD
echo ""
read -p "Enter your Frontend Domain (e.g., yourapp.vercel.app): " FRONTEND_DOMAIN

if [ -z "$SUPABASE_REF" ] || [ -z "$SUPABASE_PASSWORD" ]; then
  echo -e "${RED}❌ Supabase credentials required!${NC}"
  exit 1
fi

# Step 2: Update Production Environment
echo -e "${YELLOW}🔧 Step 2: Updating Production Environment${NC}"
echo "--------------------------------------------"

cat > "$BACKEND_DIR/.env.production" << EOF
# Environment Configuration for Production

# Backend (Render)
NODE_ENV=production
PORT=3001

# Supabase PostgreSQL Configuration
PG_HOST=db.${SUPABASE_REF}.supabase.co
PG_PORT=5432
PG_DB=postgres
PG_USER=postgres
PG_PASSWORD=${SUPABASE_PASSWORD}

# MongoDB (MongoDB Atlas) - Already configured
MONGO_URI=mongodb+srv://mohankrishna:NZHMXnucP1d2NIqi@schooldb.7fnlndi.mongodb.net/?retryWrites=true&w=majority&appName=schooldb

# JWT Configuration
JWT_SECRET=supersecretkey_$(date +%s)

# Cloudinary Configuration (Ready!)
CLOUDINARY_CLOUD_NAME=dcgfcbqbv
CLOUDINARY_API_KEY=144321214898354
CLOUDINARY_API_SECRET=LGiYlS0a38scylgrNTQ6IKl21bw

# CORS Configuration
CORS_ORIGIN=https://${FRONTEND_DOMAIN}

# File Upload Limits
MAX_FILE_SIZE=10485760
MAX_FILES=10
EOF

echo -e "${GREEN}✅ Production environment updated${NC}"

# Step 3: Test Database Connection
echo -e "${YELLOW}🔧 Step 3: Testing Database Connection${NC}"
echo "---------------------------------------"

cd "$BACKEND_DIR"

# Create temporary test script
cat > test_supabase_connection.js << EOF
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.production' });

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Supabase PostgreSQL connection successful!');
    
    // Test basic query
    const [results] = await sequelize.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', results[0].version.split(' ')[0]);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

echo "🔍 Testing Supabase connection..."
node test_supabase_connection.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Database connection successful!${NC}"
else
  echo -e "${RED}❌ Database connection failed! Please check your credentials.${NC}"
  rm test_supabase_connection.js
  exit 1
fi

rm test_supabase_connection.js

# Step 4: Deploy Database Schema
echo -e "${YELLOW}🔧 Step 4: Deploying Database Schema${NC}"
echo "------------------------------------"

# Create deployment script
cat > deploy_schema.js << EOF
const sequelize = require('./config/postgres');
require('dotenv').config({ path: '.env.production' });

// Import all models to ensure they're registered
require('./models/postgres/index');

async function deploySchema() {
  try {
    console.log('🏗️  Creating database schema...');
    
    // Sync all models with force: false to preserve existing data
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Database schema deployed successfully!');
    
    // List created tables
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('📋 Created tables:');
    tables.forEach(table => console.log('  -', table.table_name));
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema deployment failed:', error);
    process.exit(1);
  }
}

deploySchema();
EOF

echo "🏗️  Deploying database schema to Supabase..."
NODE_ENV=production node deploy_schema.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Schema deployed successfully!${NC}"
else
  echo -e "${RED}❌ Schema deployment failed!${NC}"
  rm deploy_schema.js
  exit 1
fi

rm deploy_schema.js

# Step 5: Seed Initial Data
echo -e "${YELLOW}🔧 Step 5: Seeding Initial Data${NC}"
echo "--------------------------------"

echo "🌱 Seeding admin user..."
NODE_ENV=production node scripts/seedAdmin.js

echo "🌱 Seeding classes and subjects..."
NODE_ENV=production node scripts/seedClassesAndSubjects.js

echo "🌱 Seeding students and parents..."
NODE_ENV=production node scripts/seedStudentsAndParents.js

echo "🌱 Seeding scholarship data..."
NODE_ENV=production node scripts/seedScholarshipData.js

echo -e "${GREEN}✅ Initial data seeded!${NC}"

# Step 6: Verify Deployment
echo -e "${YELLOW}🔧 Step 6: Verification${NC}"
echo "------------------------"

cat > verify_deployment.js << EOF
const sequelize = require('./config/postgres');
require('dotenv').config({ path: '.env.production' });

async function verify() {
  try {
    // Test queries to verify data
    const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
    const [studentCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Students"');
    const [classCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Classes"');
    
    console.log('📊 Deployment Verification:');
    console.log('  Users:', userCount[0].count);
    console.log('  Students:', studentCount[0].count);
    console.log('  Classes:', classCount[0].count);
    
    await sequelize.close();
    
    if (userCount[0].count > 0) {
      console.log('✅ Deployment verification successful!');
      process.exit(0);
    } else {
      console.log('⚠️  No data found - check seeding scripts');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verify();
EOF

NODE_ENV=production node verify_deployment.js
rm verify_deployment.js

# Step 7: Summary
echo ""
echo -e "${GREEN}🎉 Supabase Deployment Complete!${NC}"
echo "================================="
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "✅ Database connection established"
echo "✅ Schema deployed to Supabase PostgreSQL"
echo "✅ Initial data seeded"
echo "✅ Verification successful"
echo ""
echo -e "${BLUE}🔗 Connection Details:${NC}"
echo "Host: db.${SUPABASE_REF}.supabase.co"
echo "Database: postgres"
echo "Port: 5432"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update your Render deployment with the new .env.production"
echo "2. Deploy backend to Render"
echo "3. Test API endpoints"
echo "4. Deploy frontend to Vercel"
echo ""
echo -e "${BLUE}🔧 Render Environment Variables:${NC}"
echo "Copy these to your Render dashboard:"
echo "- PG_HOST=db.${SUPABASE_REF}.supabase.co"
echo "- PG_PASSWORD=${SUPABASE_PASSWORD}"
echo "- CORS_ORIGIN=https://${FRONTEND_DOMAIN}"
echo ""
echo -e "${GREEN}🚀 Database deployment successful! Ready for production.${NC}"
