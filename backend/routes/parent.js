const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  getChildAttendance, 
  getChildMarks, 
  getParentPTMs, 
  confirmPTM, 
  getPTMDetails,
  getActiveScholarships,
  getScholarshipDetailsForParent,
  getDailyMealPlan,
  getChildMealConsumption,
  submitMealFeedback
} = require('../controllers/parentController');

router.get('/attendance/child/:parentId', auth(['parent']), getChildAttendance);
router.get('/marks/child/:parentId', auth(['parent']), getChildMarks);

// PTM routes
router.get('/ptms', auth(['parent']), getParentPTMs);
router.put('/ptm/:ptmId/confirm', auth(['parent']), confirmPTM);
router.get('/ptm/:ptmId', auth(['parent']), getPTMDetails);

// Scholarship routes
router.get('/scholarships', auth(['parent']), getActiveScholarships);
router.get('/scholarships/:scholarshipId', auth(['parent']), getScholarshipDetailsForParent);

// Meal system routes
router.get('/daily-meal-plan', auth(['parent']), getDailyMealPlan);
router.get('/child-meal-consumption', auth(['parent']), getChildMealConsumption);
router.post('/meal-feedback', auth(['parent']), submitMealFeedback);

module.exports = router;