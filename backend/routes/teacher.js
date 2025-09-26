const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  addAttendance, 
  addMarks, 
  schedulePTM, 
  getTeacherPTMs, 
  updatePTMStatus,
  getStudentsForPTM,
  getStudentsByClass
} = require('../controllers/teacherController');

router.post('/attendance', auth(['teacher']), addAttendance);
router.post('/marks', auth(['teacher']), addMarks);

// PTM routes
router.post('/ptm', auth(['teacher']), schedulePTM);
router.get('/ptms', auth(['teacher']), getTeacherPTMs);
router.put('/ptm/:ptmId/status', auth(['teacher']), updatePTMStatus);
router.get('/students-for-ptm', auth(['teacher']), getStudentsForPTM);

// Student management routes
router.get('/students-by-class', auth(['teacher']), getStudentsByClass);

module.exports = router;