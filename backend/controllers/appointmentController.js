const Appointment = require('../models/Appointment');
const PricingPlan = require('../models/PricingPlan'); // Corrected import

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { name, email, phone, preferredDate, message, planId } = req.body;

    // Verify that the plan exists
    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Selected plan not found'
      });
    }

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      preferredDate,
      message,
      plan: planId
    });

    // Populate plan details
    await appointment.populate('plan');

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all appointments (admin only)
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('plan')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update appointment status (admin only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('plan');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};