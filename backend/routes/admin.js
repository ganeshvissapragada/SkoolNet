const router = require('express').Router();
const auth = require('../middleware/auth');
const { createUser } = require('../controllers/adminController');

router.post('/users', auth(['admin']), createUser);

module.exports = router;