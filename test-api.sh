#!/bin/bash

echo "=== Testing Landing Page Data Flow ==="
echo

echo "1. Testing public API endpoint..."
echo "GET http://localhost:3001/api/landing-page-data"
curl -s http://localhost:3001/api/landing-page-data | jq '.'

echo
echo "2. Testing admin login (you need to replace with actual admin credentials)..."
echo "POST http://localhost:3001/auth/login"

# You can add your admin credentials here for testing
# ADMIN_EMAIL="admin@school.com"
# ADMIN_PASSWORD="admin123"
# TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
#   -H "Content-Type: application/json" \
#   -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" | jq -r '.token')

echo
echo "3. If you have a valid admin token, you can test updating school info:"
echo "POST http://localhost:3001/api/admin/school-info"
echo "(This requires authentication)"

echo
echo "4. Check if changes reflect in public API:"
echo "GET http://localhost:3001/api/landing-page-data"
