const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  getAttendance, 
  getMarks, 
  getActiveScholarships,
  getScholarshipDetailsForStudent
} = require('../controllers/studentController');

router.get('/attendance/:studentId', auth(['student']), getAttendance);
router.get('/marks/:studentId', auth(['student']), getMarks);

// Scholarship routes
router.get('/scholarships', auth(['student']), getActiveScholarships);
router.get('/scholarships/:scholarshipId', auth(['student']), getScholarshipDetailsForStudent);

module.exports = router;