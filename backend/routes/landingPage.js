const router = require('express').Router();
const auth = require('../middleware/auth');
const landingPageData = require('../controllers/landingPageDataStore');
const multer = require('multer');
const path = require('path');
const { cloudinary, albumStorage, albumCoverStorage } = require('../config/cloudinary');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configure multer specifically for teacher photos
const teacherStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/teachers/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-teacher-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
const uploadTeacher = multer({ storage: teacherStorage });

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
    const { name, description } = req.body;
    
    // Update school info
    if (name) landingPageData.schoolInfo.name = name;
    if (description) landingPageData.schoolInfo.description = description;
    
    // Handle file uploads
    if (req.files && req.files.logo) {
      landingPageData.schoolInfo.logo = `/uploads/${req.files.logo[0].filename}`;
    }
    if (req.files && req.files.backgroundImage) {
      landingPageData.schoolInfo.backgroundImage = `/uploads/${req.files.backgroundImage[0].filename}`;
    }
    
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
      photo: req.file ? req.file.filename : null
    };
    
    landingPageData.teachers.push(newTeacher);
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
      teacher.photo = req.file.filename;
    }
    
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

router.post('/carousel', auth(['admin']), upload.single('image'), (req, res) => {
  try {
    const { title, description, order } = req.body;
    
    const newSlide = {
      id: Date.now(),
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      order: parseInt(order) || 0
    };
    
    landingPageData.carousel.push(newSlide);
    landingPageData.carousel.sort((a, b) => a.order - b.order);
    
    res.json({ message: 'Carousel slide added successfully', data: newSlide });
  } catch (error) {
    console.error('Error adding carousel slide:', error);
    res.status(500).json({ error: 'Failed to add carousel slide' });
  }
});

// Achievements management
router.get('/achievements', auth(['admin']), (req, res) => {
  try {
    res.json(landingPageData.achievements);
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

router.post('/achievements', auth(['admin']), (req, res) => {
  try {
    const { title, description, year, category, rank, icon } = req.body;
    
    const newAchievement = {
      id: Date.now(),
      title,
      description,
      year,
      category,
      rank,
      icon: icon || '🏆'
    };
    
    landingPageData.achievements.push(newAchievement);
    
    res.json({ message: 'Achievement added successfully', data: newAchievement });
  } catch (error) {
    console.error('Error adding achievement:', error);
    res.status(500).json({ error: 'Failed to add achievement' });
  }
});

router.put('/achievements/:id', auth(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, year, category, rank, icon } = req.body;
    
    const achievementIndex = landingPageData.achievements.findIndex(a => a.id === parseInt(id));
    if (achievementIndex === -1) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    landingPageData.achievements[achievementIndex] = {
      ...landingPageData.achievements[achievementIndex],
      title,
      description,
      year,
      category,
      rank,
      icon: icon || '🏆'
    };
    
    res.json({ message: 'Achievement updated successfully', data: landingPageData.achievements[achievementIndex] });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/achievements/:id', auth(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    
    const achievementIndex = landingPageData.achievements.findIndex(a => a.id === parseInt(id));
    if (achievementIndex === -1) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    landingPageData.achievements.splice(achievementIndex, 1);
    
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ error: 'Failed to delete achievement' });
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