const router = require('express').Router();
const auth = require('../middleware/auth');
const landingPageDataStore = require('../controllers/landingPageDataStore');
const landingPageData = landingPageDataStore.data;
const multer = require('multer');
const path = require('path');
const { cloudinary, albumStorage, albumCoverStorage, carouselStorage, teacherStorage, generalStorage } = require('../config/cloudinary');

// Configure multer for Cloudinary uploads
const upload = multer({ storage: generalStorage });
const uploadTeacher = multer({ storage: teacherStorage });
const uploadCarousel = multer({ storage: carouselStorage });

// Get all landing page data
router.get('/landing-page', auth(['admin']), (req, res) => {
  try {
    res.json(landingPageData);
  } catch (error) {
    console.error('Error getting landing page data:', error);
    res.status(500).json({ error: 'Failed to get landing page data' });
  }
});

// Update school information
router.post('/school-info', auth(['admin']), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]), (req, res) => {
  try {
    const { name, description, address, email, phone } = req.body;
    
    // Update school info
    if (name) landingPageData.schoolInfo.name = name;
    if (description) landingPageData.schoolInfo.description = description;
    if (address) landingPageData.schoolInfo.address = address;
    if (email) landingPageData.schoolInfo.email = email;
    if (phone) landingPageData.schoolInfo.phone = phone;
    
    // Handle file uploads - store Cloudinary URLs
    if (req.files && req.files.logo) {
      landingPageData.schoolInfo.logo = req.files.logo[0].path;
    }
    if (req.files && req.files.backgroundImage) {
      landingPageData.schoolInfo.backgroundImage = req.files.backgroundImage[0].path;
    }
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'School information updated successfully', data: landingPageData.schoolInfo });
  } catch (error) {
    console.error('Error updating school info:', error);
    res.status(500).json({ error: 'Failed to update school information' });
  }
});

// Update statistics
router.put('/stats', auth(['admin']), (req, res) => {
  try {
    const { stats } = req.body;
    landingPageData.stats = stats;
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Statistics updated successfully', data: landingPageData.stats });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Failed to update statistics' });
  }
});

// Teacher management
router.get('/teachers', auth(['admin']), (req, res) => {
  try {
    res.json(landingPageData.teachers);
  } catch (error) {
    console.error('Error getting teachers:', error);
    res.status(500).json({ error: 'Failed to get teachers' });
  }
});

router.post('/teachers', auth(['admin']), uploadTeacher.single('photo'), (req, res) => {
  try {
    const { name, position, qualifications, experience, email, phone } = req.body;
    
    const newTeacher = {
      id: Date.now(),
      name,
      position,
      qualifications,
      experience,
      email,
      phone,
      photo: req.file ? req.file.path : null
    };
    
    landingPageData.teachers.push(newTeacher);
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Teacher added successfully', data: newTeacher });
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ error: 'Failed to add teacher' });
  }
});

router.put('/teachers/:id', auth(['admin']), uploadTeacher.single('photo'), (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, qualifications, experience, email, phone } = req.body;
    
    const teacherIndex = landingPageData.teachers.findIndex(t => t.id == id);
    if (teacherIndex === -1) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const teacher = landingPageData.teachers[teacherIndex];
    teacher.name = name || teacher.name;
    teacher.position = position || teacher.position;
    teacher.qualifications = qualifications || teacher.qualifications;
    teacher.experience = experience || teacher.experience;
    teacher.email = email || teacher.email;
    teacher.phone = phone || teacher.phone;
    
    if (req.file) {
      teacher.photo = req.file.path;
    }
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Teacher updated successfully', data: teacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

router.delete('/teachers/:id', auth(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const teacherIndex = landingPageData.teachers.findIndex(t => t.id == id);
    
    if (teacherIndex === -1) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    landingPageData.teachers.splice(teacherIndex, 1);
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

// Albums management
// Albums will be handled in the ALBUM ROUTES section below

// Carousel management
router.get('/carousel', auth(['admin']), (req, res) => {
  try {
    res.json(landingPageData.carousel);
  } catch (error) {
    console.error('Error getting carousel:', error);
    res.status(500).json({ error: 'Failed to get carousel' });
  }
});

router.post('/carousel', auth(['admin']), uploadCarousel.single('image'), (req, res) => {
  try {
    const { title, subtitle, order } = req.body;
    
    const newSlide = {
      id: Date.now(),
      title,
      subtitle,
      image: req.file ? req.file.path : null,
      order: parseInt(order) || 0
    };
    
    landingPageData.carousel.push(newSlide);
    landingPageData.carousel.sort((a, b) => a.order - b.order);
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Carousel slide added successfully', data: newSlide });
  } catch (error) {
    console.error('Error adding carousel slide:', error);
    res.status(500).json({ error: 'Failed to add carousel slide' });
  }
});

// Update carousel slide
router.put('/carousel/:id', auth(['admin']), uploadCarousel.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, order } = req.body;
    
    const slideIndex = landingPageData.carousel.findIndex(slide => slide.id === parseInt(id));
    if (slideIndex === -1) {
      return res.status(404).json({ error: 'Carousel slide not found' });
    }
    
    const slide = landingPageData.carousel[slideIndex];
    
    landingPageData.carousel[slideIndex] = {
      ...slide,
      title,
      subtitle,
      image: req.file ? req.file.path : slide.image,
      order: parseInt(order) || slide.order
    };
    
    landingPageData.carousel.sort((a, b) => a.order - b.order);
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Carousel slide updated successfully', data: landingPageData.carousel[slideIndex] });
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    res.status(500).json({ error: 'Failed to update carousel slide' });
  }
});

// Delete carousel slide
router.delete('/carousel/:id', auth(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    
    const slideIndex = landingPageData.carousel.findIndex(slide => slide.id === parseInt(id));
    if (slideIndex === -1) {
      return res.status(404).json({ error: 'Carousel slide not found' });
    }
    
    landingPageData.carousel.splice(slideIndex, 1);
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Carousel slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    res.status(500).json({ error: 'Failed to delete carousel slide' });
  }
});

// ===================== ALBUM ROUTES =====================

// Configure multer for album uploads using Cloudinary
const uploadAlbumCover = multer({ storage: albumCoverStorage });
const uploadAlbumImages = multer({ storage: albumStorage });

// Get all albums
router.get('/albums', auth(['admin']), (req, res) => {
  try {
    res.json(landingPageData.albums);
  } catch (error) {
    console.error('Error getting albums:', error);
    res.status(500).json({ error: 'Failed to get albums' });
  }
});

// Create new album
router.post('/albums', auth(['admin']), uploadAlbumImages.any(), async (req, res) => {
  try {
    const { title, description, category, date } = req.body;
    
    // Handle cover image and photos
    let coverImage = null;
    let photos = [];
    
    if (req.files && req.files.length > 0) {
      // Separate cover image and photos based on fieldname
      req.files.forEach(file => {
        if (file.fieldname === 'coverImage') {
          coverImage = file.path; // Cloudinary URL
        } else if (file.fieldname === 'photos') {
          photos.push(file.path); // Cloudinary URL
        }
      });
    }
    
    const newAlbum = {
      id: landingPageData.albums.length > 0 ? Math.max(...landingPageData.albums.map(a => a.id)) + 1 : 1,
      title,
      description,
      category: category || 'general',
      date: date || new Date().toISOString().split('T')[0],
      coverImage,
      images: photos,
      photoCount: photos.length
    };
    
    landingPageData.albums.push(newAlbum);
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Album created successfully', data: newAlbum });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Update album
router.put('/albums/:id', auth(['admin']), uploadAlbumCover.single('coverImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, date } = req.body;
    
    const albumIndex = landingPageData.albums.findIndex(a => a.id === parseInt(id));
    if (albumIndex === -1) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const album = landingPageData.albums[albumIndex];
    
    // If new cover image uploaded, delete old one from Cloudinary
    if (req.file && album.coverImage) {
      try {
        const publicId = album.coverImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`school-platform/album-covers/${publicId}`);
      } catch (error) {
        console.log('Error deleting old cover image:', error);
      }
    }
    
    landingPageData.albums[albumIndex] = {
      ...album,
      title,
      description,
      category: category || album.category,
      date: date || album.date,
      coverImage: req.file ? req.file.path : album.coverImage
    };
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Album updated successfully', data: landingPageData.albums[albumIndex] });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ error: 'Failed to update album' });
  }
});

// Delete album
router.delete('/albums/:id', auth(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const albumIndex = landingPageData.albums.findIndex(a => a.id === parseInt(id));
    if (albumIndex === -1) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const album = landingPageData.albums[albumIndex];
    
    // Delete cover image from Cloudinary
    if (album.coverImage) {
      try {
        const publicId = album.coverImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`school-platform/album-covers/${publicId}`);
      } catch (error) {
        console.log('Error deleting cover image:', error);
      }
    }
    
    // Delete all album images from Cloudinary
    if (album.images && album.images.length > 0) {
      for (const imageUrl of album.images) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`school-platform/albums/${publicId}`);
        } catch (error) {
          console.log('Error deleting album image:', error);
        }
      }
    }
    
    landingPageData.albums.splice(albumIndex, 1);
    
    // Save data to file
    landingPageDataStore.saveDataToFile();
    
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

// Add images to album
router.post('/albums/:id/images', auth(['admin']), uploadAlbumImages.array('images', 20), async (req, res) => {
  try {
    const { id } = req.params;
    
    const albumIndex = landingPageData.albums.findIndex(a => a.id === parseInt(id));
    if (albumIndex === -1) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const album = landingPageData.albums[albumIndex];
    const newImages = req.files.map(file => file.path); // Cloudinary URLs
    
    album.images = album.images || [];
    album.images.push(...newImages);
    album.photoCount = album.images.length;
    
    res.json({ 
      message: 'Images added successfully', 
      data: { 
        addedImages: newImages, 
        totalImages: album.images.length 
      } 
    });
  } catch (error) {
    console.error('Error adding images to album:', error);
    res.status(500).json({ error: 'Failed to add images to album' });
  }
});

// Remove image from album
router.delete('/albums/:id/images', auth(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    const albumIndex = landingPageData.albums.findIndex(a => a.id === parseInt(id));
    if (albumIndex === -1) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const album = landingPageData.albums[albumIndex];
    const imageIndex = album.images.indexOf(imageUrl);
    
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found in album' });
    }
    
    // Delete image from Cloudinary
    try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`school-platform/albums/${publicId}`);
    } catch (error) {
      console.log('Error deleting image from Cloudinary:', error);
    }
    
    album.images.splice(imageIndex, 1);
    album.photoCount = album.images.length;
    
    res.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Error removing image from album:', error);
    res.status(500).json({ error: 'Failed to remove image from album' });
  }
});

module.exports = router;