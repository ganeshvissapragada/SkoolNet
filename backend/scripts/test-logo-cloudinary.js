#!/usr/bin/env node

/**
 * Test Script for School Logo Upload to Cloudinary
 * This script tests the logo upload functionality through the admin panel
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

// Admin login credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@school.com',
  password: 'admin123'
};

let authToken = '';

async function login() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, ADMIN_CREDENTIALS);
    authToken = response.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testLogoUpload() {
  try {
    console.log('\n🏫 Testing school logo upload...');
    
    // Check if there's a test logo file
    const testLogoPath = path.join(__dirname, '../public/assets/icons/school_icon.png');
    
    if (!fs.existsSync(testLogoPath)) {
      console.log('⚠️  No test logo found, skipping logo upload test');
      return;
    }

    const formData = new FormData();
    formData.append('name', 'ZPHS Pendyala Test');
    formData.append('description', 'Test description for logo upload');
    formData.append('address', 'Test Address, Pendyala');
    formData.append('email', 'test@zphspendyala.edu');
    formData.append('phone', '+91-1234567890');
    formData.append('logo', fs.createReadStream(testLogoPath));

    const response = await axios.post(`${API_BASE_URL}/api/admin/school-info`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Logo upload successful:', response.data);
    console.log('📍 Logo Cloudinary URL:', response.data.data?.logo);
    
  } catch (error) {
    console.error('❌ Logo upload failed:', error.response?.data?.error || error.message);
  }
}

async function testLogoDisplay() {
  try {
    console.log('\n👁️  Testing logo display in public API...');
    
    const response = await axios.get(`${API_BASE_URL}/api/public/landing-page-data`);

    console.log('✅ Public data retrieval successful');
    console.log('🏫 School Info:', {
      name: response.data.schoolInfo?.name,
      logo: response.data.schoolInfo?.logo
    });
    
    if (response.data.schoolInfo?.logo) {
      console.log('📸 Logo URL looks valid:', response.data.schoolInfo.logo.includes('cloudinary'));
    }
    
  } catch (error) {
    console.error('❌ Public data retrieval failed:', error.response?.data?.error || error.message);
  }
}

async function testCloudinaryUrl() {
  try {
    console.log('\n🔗 Testing current Cloudinary logo URL...');
    
    // Get current data to test the logo URL
    const response = await axios.get(`${API_BASE_URL}/api/public/landing-page-data`);
    const logoUrl = response.data.schoolInfo?.logo;
    
    if (logoUrl && logoUrl.includes('cloudinary')) {
      console.log('🧪 Testing Cloudinary URL:', logoUrl);
      
      const imageResponse = await axios.head(logoUrl);
      console.log('✅ Logo URL is accessible:', imageResponse.status === 200);
      console.log('📊 Content Type:', imageResponse.headers['content-type']);
    } else {
      console.log('⚠️  No Cloudinary logo URL found in current data');
    }
    
  } catch (error) {
    console.error('❌ Cloudinary URL test failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting School Logo Cloudinary Test');
  console.log('=====================================');

  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    process.exit(1);
  }

  // Test current logo display
  await testLogoDisplay();
  
  // Test Cloudinary URL accessibility
  await testCloudinaryUrl();
  
  // Test logo upload (optional)
  await testLogoUpload();

  console.log('\n✨ Logo test complete!');
  console.log('\n📝 Notes:');
  console.log('- School logo should now be served from Cloudinary');
  console.log('- Logo uploads through admin panel go directly to Cloudinary');
  console.log('- Logo displays on landing page without localhost prefix');
  console.log('- Logo preview in admin panel should work for both existing and new uploads');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the test
main().catch(console.error);
