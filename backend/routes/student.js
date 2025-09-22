const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAttendance, getMarks } = require('../controllers/studentController');

router.get('/attendance/:studentId', auth(['student']), getAttendance);
router.get('/marks/:studentId', auth(['student']), getMarks);

module.exports = router;