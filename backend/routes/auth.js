const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  protect,
  updatePassword
} = require('../controllers/authController');

// Admin routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;