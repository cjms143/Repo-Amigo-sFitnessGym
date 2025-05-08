const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  applicablePlans: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PricingPlan' 
  }],
  active: { 
    type: Boolean, 
    default: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add validation to ensure endDate is after startDate
eventSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Add validation for percentage discount
eventSchema.pre('save', function(next) {
  if (this.discountType === 'percentage' && (this.discountValue < 0 || this.discountValue > 100)) {
    next(new Error('Percentage discount must be between 0 and 100'));
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);