#!/usr/bin/env node

/**
 * Test Script for Cloudinary Image Upload
 * This script tests the new Cloudinary upload functionality for carousel and teacher images
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

// Admin login credentials (adjust as needed)
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

async function testCarouselUpload() {
  try {
    console.log('\n📸 Testing carousel image upload...');
    
    // Create a test file - you can replace this with an actual image file
    const testImagePath = path.join(__dirname, '../public/assets/carousel/slide1.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('⚠️  No test image found, skipping carousel upload test');
      return;
    }

    const formData = new FormData();
    formData.append('title', 'Test Carousel Image');
    formData.append('subtitle', 'Test Description');
    formData.append('order', '1');
    formData.append('image', fs.createReadStream(testImagePath));

    const response = await axios.post(`${API_BASE_URL}/api/admin/carousel`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Carousel upload successful:', response.data);
    console.log('📍 Image URL:', response.data.data?.image);
    
  } catch (error) {
    console.error('❌ Carousel upload failed:', error.response?.data?.error || error.message);
  }
}

async function testTeacherUpload() {
  try {
    console.log('\n👩‍🏫 Testing teacher photo upload...');
    
    // Create a test file - you can replace this with an actual image file
    const testImagePath = path.join(__dirname, '../public/assets/teachers/teacher1.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('⚠️  No test image found, skipping teacher upload test');
      return;
    }

    const formData = new FormData();
    formData.append('name', 'Test Teacher');
    formData.append('position', 'Math Teacher');
    formData.append('qualifications', 'M.Sc. Mathematics');
    formData.append('experience', '5 years');
    formData.append('email', 'test.teacher@school.com');
    formData.append('phone', '+91-9876543210');
    formData.append('photo', fs.createReadStream(testImagePath));

    const response = await axios.post(`${API_BASE_URL}/api/admin/teachers`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Teacher upload successful:', response.data);
    console.log('📍 Photo URL:', response.data.data?.photo);
    
  } catch (error) {
    console.error('❌ Teacher upload failed:', error.response?.data?.error || error.message);
  }
}

async function testImageRetrieval() {
  try {
    console.log('\n📥 Testing image data retrieval...');
    
    const response = await axios.get(`${API_BASE_URL}/api/admin/landing-page`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Data retrieval successful');
    console.log('🖼️  Carousel images:', response.data.carousel?.map(slide => slide.image));
    console.log('👥 Teacher photos:', response.data.teachers?.map(teacher => teacher.photo));
    
  } catch (error) {
    console.error('❌ Data retrieval failed:', error.response?.data?.error || error.message);
  }
}

async function main() {
  console.log('🚀 Starting Cloudinary Upload Test');
  console.log('==================================');

  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    process.exit(1);
  }

  // Test uploads
  await testCarouselUpload();
  await testTeacherUpload();
  await testImageRetrieval();

  console.log('\n✨ Test complete!');
  console.log('\n📝 Notes:');
  console.log('- Images are now uploaded directly to Cloudinary');
  console.log('- URLs are stored as complete Cloudinary URLs');
  console.log('- Frontend will display images directly from Cloudinary');
  console.log('- No more local file storage needed');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the test
main().catch(console.error);
