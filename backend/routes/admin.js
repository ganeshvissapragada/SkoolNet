const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  createUser,
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
  getAllMealFeedback
} = require('../controllers/adminController');

router.post('/users', auth(['admin']), createUser);

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

module.exports = router;