const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  addAttendance, 
  addMarks, 
  schedulePTM, 
  getTeacherPTMs, 
  updatePTMStatus,
  getStudentsForPTM,
  markMealConsumption,
  getTodaysMeal 
} = require('../controllers/teacherController');

router.post('/attendance', auth(['teacher']), addAttendance);
router.post('/marks', auth(['teacher']), addMarks);

// PTM routes
router.post('/ptm', auth(['teacher']), schedulePTM);
router.get('/ptms', auth(['teacher']), getTeacherPTMs);
router.put('/ptm/:ptmId/status', auth(['teacher']), updatePTMStatus);
router.get('/students-for-ptm', auth(['teacher']), getStudentsForPTM);

// Meal system routes
router.post('/meal-consumption', auth(['teacher']), markMealConsumption);
router.get('/todays-meal', auth(['teacher']), getTodaysMeal);

module.exports = router;