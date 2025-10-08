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

module.exports = {
  cloudinary,
  albumStorage,
  albumCoverStorage
};
