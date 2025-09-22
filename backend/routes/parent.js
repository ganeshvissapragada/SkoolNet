const router = require('express').Router();
const auth = require('../middleware/auth');
const { getChildAttendance, getChildMarks } = require('../controllers/parentController');

router.get('/attendance/child/:parentId', auth(['parent']), getChildAttendance);
router.get('/marks/child/:parentId', auth(['parent']), getChildMarks);

module.exports = router;