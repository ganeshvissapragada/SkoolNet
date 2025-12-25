# Dynamic Asset Management with Cloudinary

This document explains how carousel images and teacher photos are now managed dynamically through the admin panel with Cloudinary storage.

## Overview

The school platform now uses Cloudinary for dynamic image storage instead of static assets. This allows administrators to:

- Upload carousel images directly through the admin panel
- Upload teacher photos through the admin panel
- Automatically optimize images for web display
- Manage images without requiring code deployments

## Architecture

### Backend (Node.js/Express)
- **Cloudinary Integration**: `/backend/config/cloudinary.js`
- **Upload Routes**: `/backend/routes/landingPage.js`
- **Storage Configurations**:
  - Carousel images: `school-platform/carousel` folder
  - Teacher photos: `school-platform/teachers` folder
  - General assets: `school-platform/general` folder

### Frontend (React)
- **Admin Panel**: `/frontend/src/pages/AdminLandingPageManager.jsx`
- **Image Display**: Images use direct Cloudinary URLs
- **Landing Page**: `/frontend/src/pages/SchoolLandingPage.jsx`

## Image Upload Workflow

### 1. Carousel Images
1. Admin logs into the admin panel
2. Navigates to "Landing Page" → "Hero Carousel Images"
3. Clicks "Add Image" and uploads a new carousel image
4. Image is automatically uploaded to Cloudinary with optimizations:
   - Resized to 1920x1080 pixels
   - Optimized quality
   - Stored in `school-platform/carousel` folder

### 2. Teacher Photos
1. Admin navigates to "Landing Page" → "Faculty Showcase"
2. Clicks "Add Teacher" and fills out teacher information
3. Uploads teacher photo which is automatically:
   - Resized to 400x400 pixels
   - Optimized with face detection cropping
   - Stored in `school-platform/teachers` folder

## Technical Implementation

### Cloudinary Configuration
```javascript
// Carousel storage
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

// Teacher storage
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
```

### Frontend Image Display
```jsx
// Carousel images - direct Cloudinary URL
<img src={slide.image} alt={`Slide ${slide.id}`} />

// Teacher photos - direct Cloudinary URL  
<img src={teacher.photo} alt={teacher.name} />
```

## Environment Variables

### Backend (.env)
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Production (Render)
These are automatically configured in `render.yaml`:
```yaml
CLOUDINARY_CLOUD_NAME=dcgfcbqbv
CLOUDINARY_API_KEY=144321214898354
CLOUDINARY_API_SECRET=LGiYlS0a38scylgrNTQ6IKl21bw
```

## Migration from Static Assets

If you have existing static assets, use the migration script:

```bash
cd backend
node scripts/migrate-to-cloudinary.js
```

This will:
1. Upload existing local images to Cloudinary
2. Update database records with Cloudinary URLs
3. Preserve existing image references

## Testing

Use the test script to verify uploads work correctly:

```bash
cd backend
node scripts/test-cloudinary-upload.js
```

## API Endpoints

### Carousel Management
- `POST /api/admin/carousel` - Upload new carousel image
- `PUT /api/admin/carousel/:id` - Update carousel image
- `DELETE /api/admin/carousel/:id` - Delete carousel image
- `GET /api/admin/landing-page` - Get all carousel images

### Teacher Management
- `POST /api/admin/teachers` - Add teacher with photo
- `PUT /api/admin/teachers/:id` - Update teacher and photo
- `DELETE /api/admin/teachers/:id` - Delete teacher
- `GET /api/admin/teachers` - Get all teachers

## Image Optimization

Cloudinary automatically applies optimizations:

### Carousel Images
- Format: Auto-select best format (WebP, AVIF, etc.)
- Quality: Auto-optimized for web
- Size: 1920x1080 pixels (crop fill)
- Loading: Lazy loading supported

### Teacher Photos
- Format: Auto-select best format
- Quality: Auto-optimized for web  
- Size: 400x400 pixels (crop fill with face detection)
- Loading: Lazy loading supported

## Benefits

1. **Dynamic Management**: No code changes needed to update images
2. **Optimization**: Automatic image optimization and format selection
3. **Performance**: CDN delivery for fast loading
4. **Storage**: No server storage needed for images
5. **Scalability**: Unlimited image storage with Cloudinary
6. **Backup**: Images are stored in cloud with redundancy

## Troubleshooting

### Images Not Loading
1. Check Cloudinary credentials in environment variables
2. Verify image URLs in browser network tab
3. Check admin panel console for upload errors

### Upload Failures
1. Verify file format is supported (jpg, jpeg, png, gif, webp)
2. Check file size limits
3. Verify Cloudinary account has sufficient quota

### Display Issues
1. Check browser console for CORS errors
2. Verify image URLs are complete Cloudinary URLs
3. Test image URLs directly in browser

## Future Enhancements

1. **Image Gallery**: Add album management for school events
2. **Bulk Upload**: Support multiple image uploads at once
3. **Image Editor**: Basic editing capabilities in admin panel
4. **Analytics**: Track image performance and usage
5. **Backup**: Automatic backup of image metadata
