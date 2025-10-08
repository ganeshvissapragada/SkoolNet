const router = require('express').Router();
const auth = require('../middleware/auth');
const landingPageData = require('../controllers/landingPageDataStore');
const multer = require('multer');
const path = require('path');

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
router.get('/albums', auth(['admin']), (req, res) => {
  try {
    res.json(landingPageData.albums);
  } catch (error) {
    console.error('Error getting albums:', error);
    res.status(500).json({ error: 'Failed to get albums' });
  }
});

router.post('/albums', auth(['admin']), upload.array('photos', 10), (req, res) => {
  try {
    const { title, description, category, date } = req.body;
    
    const photos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const newAlbum = {
      id: Date.now(),
      title,
      description,
      category,
      date,
      photos,
      photoCount: photos.length
    };
    
    landingPageData.albums.push(newAlbum);
    res.json({ message: 'Album created successfully', data: newAlbum });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

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

module.exports = router;