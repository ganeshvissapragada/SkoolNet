#!/usr/bin/env node

/**
 * Migration Script: Convert Local Images to Cloudinary
 * This script uploads existing local images to Cloudinary and updates database records
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const landingPageDataStore = require('../controllers/landingPageDataStore');

async function uploadToCloudinary(localPath, folder, transformations = {}) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: `school-platform/${folder}`,
      ...transformations
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${localPath}:`, error.message);
    return null;
  }
}

async function migrateCarouselImages() {
  console.log('\n📸 Migrating carousel images...');
  
  const data = landingPageDataStore.data;
  let migrated = 0;

  for (const slide of data.carousel) {
    if (slide.image && slide.image.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '../', slide.image);
      
      if (fs.existsSync(localPath)) {
        console.log(`Uploading carousel image: ${slide.image}`);
        
        const cloudinaryUrl = await uploadToCloudinary(localPath, 'carousel', {
          transformation: [
            { width: 1920, height: 1080, crop: 'fill', quality: 'auto' }
          ]
        });

        if (cloudinaryUrl) {
          slide.image = cloudinaryUrl;
          migrated++;
          console.log(`✅ Migrated: ${cloudinaryUrl}`);
        }
      } else {
        console.log(`⚠️  File not found: ${localPath}`);
      }
    }
  }

  console.log(`📊 Carousel migration complete: ${migrated} images migrated`);
}

async function migrateTeacherImages() {
  console.log('\n👩‍🏫 Migrating teacher photos...');
  
  const data = landingPageDataStore.data;
  let migrated = 0;

  for (const teacher of data.teachers) {
    if (teacher.photo && !teacher.photo.startsWith('http')) {
      const localPath = path.join(__dirname, '../uploads/teachers/', teacher.photo);
      
      if (fs.existsSync(localPath)) {
        console.log(`Uploading teacher photo: ${teacher.name} - ${teacher.photo}`);
        
        const cloudinaryUrl = await uploadToCloudinary(localPath, 'teachers', {
          transformation: [
            { width: 400, height: 400, crop: 'fill', quality: 'auto', gravity: 'face' }
          ]
        });

        if (cloudinaryUrl) {
          teacher.photo = cloudinaryUrl;
          migrated++;
          console.log(`✅ Migrated: ${teacher.name} - ${cloudinaryUrl}`);
        }
      } else {
        console.log(`⚠️  File not found: ${localPath}`);
      }
    }
  }

  console.log(`📊 Teacher migration complete: ${migrated} photos migrated`);
}

async function migrateSchoolAssets() {
  console.log('\n🏫 Migrating school assets...');
  
  const data = landingPageDataStore.data;
  let migrated = 0;

  // Migrate school logo
  if (data.schoolInfo.logo && data.schoolInfo.logo.startsWith('/uploads/')) {
    const localPath = path.join(__dirname, '../', data.schoolInfo.logo);
    
    if (fs.existsSync(localPath)) {
      console.log(`Uploading school logo: ${data.schoolInfo.logo}`);
      
      const cloudinaryUrl = await uploadToCloudinary(localPath, 'general', {
        transformation: [{ quality: 'auto' }]
      });

      if (cloudinaryUrl) {
        data.schoolInfo.logo = cloudinaryUrl;
        migrated++;
        console.log(`✅ Logo migrated: ${cloudinaryUrl}`);
      }
    }
  }

  // Migrate background image
  if (data.schoolInfo.backgroundImage && data.schoolInfo.backgroundImage.startsWith('/uploads/')) {
    const localPath = path.join(__dirname, '../', data.schoolInfo.backgroundImage);
    
    if (fs.existsSync(localPath)) {
      console.log(`Uploading background image: ${data.schoolInfo.backgroundImage}`);
      
      const cloudinaryUrl = await uploadToCloudinary(localPath, 'general', {
        transformation: [{ quality: 'auto' }]
      });

      if (cloudinaryUrl) {
        data.schoolInfo.backgroundImage = cloudinaryUrl;
        migrated++;
        console.log(`✅ Background image migrated: ${cloudinaryUrl}`);
      }
    }
  }

  console.log(`📊 School assets migration complete: ${migrated} assets migrated`);
}

async function main() {
  console.log('🚀 Starting Local to Cloudinary Migration');
  console.log('==========================================');

  // Check Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary configuration missing. Please set environment variables:');
    console.error('   CLOUDINARY_CLOUD_NAME');
    console.error('   CLOUDINARY_API_KEY');
    console.error('   CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  try {
    // Test Cloudinary connection
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful');

    // Run migrations
    await migrateCarouselImages();
    await migrateTeacherImages();
    await migrateSchoolAssets();

    // Save updated data
    landingPageDataStore.saveDataToFile();
    console.log('\n💾 Updated data saved to file');

    console.log('\n✨ Migration complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy the updated backend to Render');
    console.log('2. Deploy the updated frontend to Vercel');
    console.log('3. Test image uploads and display in production');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the migration
main().catch(console.error);
