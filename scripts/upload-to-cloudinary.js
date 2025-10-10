const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dcgfcbqbv',
  api_key: '144321214898354',
  api_secret: 'LGiYlS0a38scylgrNTQ6IKl21bw'
});

const uploadAssets = async () => {
  console.log('🌟 Starting Cloudinary Asset Upload...');
  console.log('=====================================');
  
  const uploads = [];
  
  try {
    // Upload carousel images with better names
    console.log('📤 Uploading carousel images...');
    
    const carouselUploads = [
      {
        path: 'frontend/src/assets/carousel/WhatsApp Image 2025-09-06 at 18.44.53.jpeg',
        publicId: 'school-platform/carousel/school-event-1',
        folder: 'carousel'
      },
      {
        path: 'frontend/src/assets/carousel/WhatsApp Image 2025-09-06 at 18.44.54.jpeg', 
        publicId: 'school-platform/carousel/school-event-2',
        folder: 'carousel'
      },
      {
        path: 'frontend/src/assets/carousel/WhatsApp Image 2025-09-06 at 18.44.55.jpeg',
        publicId: 'school-platform/carousel/school-event-3', 
        folder: 'carousel'
      },
      {
        path: 'frontend/src/assets/logincard/sidecard.jpg',
        publicId: 'school-platform/login/background',
        folder: 'login'
      },
      {
        path: 'frontend/src/assets/teachers/PLN_Phanikumar_SA.png',
        publicId: 'school-platform/teachers/phanikumar',
        folder: 'teachers'
      }
    ];
    
    for (const upload of carouselUploads) {
      if (fs.existsSync(upload.path)) {
        console.log(`📤 Uploading ${upload.folder}: ${path.basename(upload.path)}`);
        
        const result = await cloudinary.uploader.upload(upload.path, {
          public_id: upload.publicId,
          overwrite: true,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto'
        });
        
        uploads.push({
          originalPath: upload.path,
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
          size: result.bytes,
          folder: upload.folder
        });
        
        console.log(`✅ Success: ${result.secure_url}`);
        console.log(`📊 Size: ${Math.round(result.bytes / 1024)}KB`);
        console.log('');
      } else {
        console.log(`⚠️  File not found: ${upload.path}`);
      }
    }
    
    console.log('🎉 Upload Complete!');
    console.log('==================');
    console.log(`📊 Total files uploaded: ${uploads.length}`);
    console.log(`💾 Total size: ${Math.round(uploads.reduce((sum, u) => sum + u.size, 0) / 1024)}KB`);
    console.log('');
    
    // Generate updated URLs for components
    console.log('🔗 Cloudinary URLs for your components:');
    console.log('=====================================');
    
    uploads.forEach(upload => {
      const optimizedUrl = upload.cloudinaryUrl.replace('/upload/', '/upload/q_auto,f_auto/');
      console.log(`${upload.folder.toUpperCase()}: ${optimizedUrl}`);
    });
    
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('1. Update your component imports with these URLs');
    console.log('2. Add VITE_CLOUDINARY_CLOUD_NAME=dcgfcbqbv to frontend environment');
    console.log('3. Test the updated components');
    console.log('4. Deploy to production!');
    
    return uploads;
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

// Run the upload
uploadAssets()
  .then(results => {
    console.log('✨ All uploads completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Upload process failed:', error);
    process.exit(1);
  });
