const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', createAppointment);

// Protected routes (admin only)
router.get('/', protect, getAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);

module.exports = router;