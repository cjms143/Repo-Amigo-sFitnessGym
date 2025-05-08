const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['basic', 'facility', 'class', 'trainer', 'equipment', 'cardio', 'strength', 'wellness', 'nutrition', 'extra'],
    default: 'basic'
  },
  highlight: {
    type: Boolean,
    default: false
  },
  description: String
});

const pricingPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Plan title is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: [true, 'Plan type is required'],
    default: 'monthly'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [featureSchema],
  isPopular: {
    type: Boolean,
    default: false
  },
  availability: {
    type: String,
    default: 'always'
  },
  active: {
    type: Boolean,
    default: true
  },
  termsAndConditions: {
    type: String,
    trim: true
  },
  metadata: {
    views: { type: Number, default: 0 },
    subscriptions: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pricingPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

pricingPlanSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);