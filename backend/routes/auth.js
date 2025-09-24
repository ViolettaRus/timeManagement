const express = require('express');
const { register, login, updateUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update', protect, updateUser);

module.exports = router;