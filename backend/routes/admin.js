const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  createUser,
  getUsers,
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  toggleScholarshipStatus,
  createMealPlan,
  getMealPlans,
  getMealDashboard,
  getMealFeedback,
  getAllMealFeedback,
  createClass,
  getAllClasses,
  deleteClass,
  createSubject,
  getAllSubjects,
  deleteSubject,
  getClassesAndSubjects,
  getTeachers,
  createTeacherAssignment,
  getTeacherAssignments,
  updateTeacherAssignment,
  deleteTeacherAssignment,
  getAttendanceData
} = require('../controllers/adminController');

router.post('/users', auth(['admin']), createUser);
router.get('/users', auth(['admin']), getUsers);

// Scholarship routes
router.post('/scholarships', auth(['admin']), createScholarship);
router.get('/scholarships', auth(['admin']), getScholarships);
router.get('/scholarships/:scholarshipId', auth(['admin']), getScholarshipById);
router.put('/scholarships/:scholarshipId', auth(['admin']), updateScholarship);
router.delete('/scholarships/:scholarshipId', auth(['admin']), deleteScholarship);
router.patch('/scholarships/:scholarshipId/status', auth(['admin']), toggleScholarshipStatus);

// Meal system routes
router.post('/meal-plans', auth(['admin']), createMealPlan);
router.get('/meal-plans', auth(['admin']), getMealPlans);
router.get('/meal-dashboard', auth(['admin']), getMealDashboard);

// Meal feedback routes
router.get('/meal-feedback/:mealPlanId', auth(['admin']), getMealFeedback);
router.get('/meal-feedback', auth(['admin']), getAllMealFeedback);

// Class management routes
router.post('/classes', auth(['admin']), createClass);
router.get('/classes', auth(['admin']), getAllClasses);
router.delete('/classes/:id', auth(['admin']), deleteClass);

// Subject management routes
router.post('/subjects', auth(['admin']), createSubject);
router.get('/subjects', auth(['admin']), getAllSubjects);
router.delete('/subjects/:id', auth(['admin']), deleteSubject);

// Teacher assignment routes
router.get('/classes-subjects', auth(['admin']), getClassesAndSubjects);
router.get('/teachers', auth(['admin']), getTeachers);
router.post('/teacher-assignments', auth(['admin']), createTeacherAssignment);
router.get('/teacher-assignments', auth(['admin']), getTeacherAssignments);
router.put('/teacher-assignments/:assignmentId', auth(['admin']), updateTeacherAssignment);
router.delete('/teacher-assignments/:assignmentId', auth(['admin']), deleteTeacherAssignment);

// Attendance management routes
router.get('/attendance', auth(['admin']), getAttendanceData);

module.exports = router;