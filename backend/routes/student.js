const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  getAttendance, 
  getMarks, 
  getActiveScholarships,
  getScholarshipDetailsForStudent,
  getDailyMealPlan,
  getMyMealConsumption,
  submitMealFeedback
} = require('../controllers/studentController');

router.get('/attendance/:studentId', auth(['student']), getAttendance);
router.get('/marks/:studentId', auth(['student']), getMarks);

// Scholarship routes
router.get('/scholarships', auth(['student']), getActiveScholarships);
router.get('/scholarships/:scholarshipId', auth(['student']), getScholarshipDetailsForStudent);

// Meal system routes
router.get('/daily-meal-plan', auth(['student']), getDailyMealPlan);
router.get('/my-meal-consumption', auth(['student']), getMyMealConsumption);
router.post('/meal-feedback', auth(['student']), submitMealFeedback);

module.exports = router;