const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { 
  getAttendance, 
  getMarks, 
  getActiveScholarships,
  getScholarshipDetailsForStudent,
  getDailyMealPlan,
  getMyMealConsumption,
  submitMealFeedback,
  getAssignments,
  submitAssignment,
  getAssignmentById
} = require('../controllers/studentController');

router.get('/attendance/:studentId', auth(['student']), getAttendance);
router.get('/marks/:studentId', auth(['student']), getMarks);

// Scholarship routes
router.get('/scholarships', auth(['student']), getActiveScholarships);
router.get('/scholarships/:scholarshipId', auth(['student']), getScholarshipDetailsForStudent);

// Meal system routes
router.get('/daily-meal-plan', auth(['student']), getDailyMealPlan);
router.get('/my-meal-consumption/:studentId', auth(['student']), getMyMealConsumption);
router.post('/meal-feedback/:studentId', auth(['student']), submitMealFeedback);

// Assignment routes
router.get('/assignments', auth(['student']), getAssignments);
router.get('/assignments/:id', auth(['student']), getAssignmentById);
router.post('/assignments/:assignmentId/submit', auth(['student']), upload.array('attachments', 10), submitAssignment);

module.exports = router;