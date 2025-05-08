const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: [true, 'Promotion code is required'],
    unique: true,
    trim: true
  },
  type: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  value: { 
    type: Number, 
    required: true,
    min: [0, 'Discount value cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  maxUses: {
    type: Number,
    min: [1, 'Maximum uses must be at least 1']
  },
  currentUses: { 
    type: Number, 
    default: 0 
  },
  minPurchaseAmount: {
    type: Number,
    min: [0, 'Minimum purchase amount cannot be negative']
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
promotionSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Add validation to ensure currentUses doesn't exceed maxUses
promotionSchema.pre('save', function(next) {
  if (this.maxUses && this.currentUses > this.maxUses) {
    next(new Error('Current uses cannot exceed maximum uses'));
  }
  next();
});

module.exports = mongoose.model('Promotion', promotionSchema);