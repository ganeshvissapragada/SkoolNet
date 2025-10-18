#!/bin/bash

echo "🔍 Supabase Connection Troubleshooting Guide"
echo "==========================================="
echo ""

echo "📋 Current .env settings:"
echo "PG_HOST: $PG_HOST"
echo "PG_PORT: $PG_PORT"
echo "PG_DB: $PG_DB"
echo "PG_USER: $PG_USER"
echo "PG_PASSWORD: [HIDDEN]"
echo ""

echo "🌐 Testing DNS resolution..."
nslookup db.vjlozlmvvvhcyfdqepuz.supabase.co 2>/dev/null || echo "❌ DNS lookup failed"
echo ""

echo "🔗 Please verify your Supabase project details:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings > Database"
echo "4. Look for 'Connection string' or 'Connection pooling'"
echo ""

echo "📝 The correct format should be:"
echo "Host: db.{project-ref}.supabase.co"
echo "Port: 5432 (default) or 6543 (pooling)"
echo "Database: postgres"
echo "User: postgres"
echo ""

echo "🔧 Common issues:"
echo "• Project might be paused (check Supabase dashboard)"
echo "• Incorrect project reference in hostname"
echo "• Using pooling port (6543) vs direct port (5432)"
echo "• IP restrictions enabled (check Settings > Authentication)"
echo ""

echo "💡 Next steps:"
echo "1. Verify project is active in Supabase dashboard"
echo "2. Copy the exact connection string from Supabase Settings"
echo "3. Update your .env file with correct values"
echo "4. Test connection again"
