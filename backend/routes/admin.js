const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  createUser,
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  toggleScholarshipStatus
} = require('../controllers/adminController');

router.post('/users', auth(['admin']), createUser);

// Scholarship routes
router.post('/scholarships', auth(['admin']), createScholarship);
router.get('/scholarships', auth(['admin']), getScholarships);
router.get('/scholarships/:scholarshipId', auth(['admin']), getScholarshipById);
router.put('/scholarships/:scholarshipId', auth(['admin']), updateScholarship);
router.delete('/scholarships/:scholarshipId', auth(['admin']), deleteScholarship);
router.patch('/scholarships/:scholarshipId/status', auth(['admin']), toggleScholarshipStatus);

module.exports = router;