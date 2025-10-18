const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
});

// Create storage for albums
const albumStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-platform/albums',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
    ]
  }
});

// Create storage for album covers
const albumCoverStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-platform/album-covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 600, height: 400, crop: 'fill', quality: 'auto' }
    ]
  }
});

// Create storage for carousel images
const carouselStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-platform/carousel',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1920, height: 1080, crop: 'fill', quality: 'auto' }
    ]
  }
});

// Create storage for teacher photos
const teacherStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-platform/teachers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', quality: 'auto', gravity: 'face' }
    ]
  }
});

// Create storage for general uploads (school logo, icons, etc.)
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-platform/general',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    transformation: [
      { quality: 'auto' }
    ]
  }
});

module.exports = {
  cloudinary,
  albumStorage,
  albumCoverStorage,
  carouselStorage,
  teacherStorage,
  generalStorage
};
