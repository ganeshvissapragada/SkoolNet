const router = require('express').Router();
const auth = require('../middleware/auth');
const { addAttendance, addMarks } = require('../controllers/teacherController');

router.post('/attendance', auth(['teacher']), addAttendance);
router.post('/marks', auth(['teacher']), addMarks);

module.exports = router;