const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  addAttendance, 
  addMarks, 
  schedulePTM, 
  getTeacherPTMs, 
  updatePTMStatus,
  getStudentsForPTM,
  getStudentsByClass,
  createAssignment,
  getMyAssignments,
  getAssignmentById,
  updateAssignment,
  gradeSubmission,
  requestResubmission,
  getClassesAndSubjects
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

// Assignment routes
router.post('/assignments', auth(['teacher']), createAssignment);
router.get('/assignments', auth(['teacher']), getMyAssignments);
router.get('/assignments/:id', auth(['teacher']), getAssignmentById);
router.put('/assignments/:id', auth(['teacher']), updateAssignment);
router.put('/submissions/:submissionId/grade', auth(['teacher']), gradeSubmission);
router.put('/submissions/:submissionId/request-resubmission', auth(['teacher']), requestResubmission);
router.get('/classes-subjects', auth(['teacher']), getClassesAndSubjects);
router.get('/my-assignments', auth(['teacher']), getMyAssignments);

module.exports = router;