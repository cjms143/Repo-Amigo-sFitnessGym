const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issuer: String,
  year: Number,
  icon: {
    type: String,
    enum: ['FaDumbbell', 'FaHeartbeat', 'FaMedal', 'FaGraduationCap', 'FaCertificate', 'FaAward'],
    default: 'FaCertificate'
  }
});

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  slots: {
    type: [String],
    enum: ['Morning', 'Afternoon', 'Evening']
  }
}, { _id: false });

const specializationSchema = new mongoose.Schema({
  area: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  }
});

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  year: Number
});

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  specialty: {
    type: [String],
    required: [true, 'At least one specialty is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  qualifications: [qualificationSchema],
  certifications: [String],
  bio: {
    type: String,
    required: [true, 'Bio is required']
  },
  expertise: [{
    type: String,
    enum: [
      'Weight Training',
      'Cardio',
      'HIIT',
      'Yoga',
      'Pilates',
      'CrossFit',
      'Martial Arts',
      'Nutrition',
      'Sports Performance',
      'Rehabilitation',
      'Senior Fitness',
      'Pre/Post Natal',
      'Group Training',
      'Personal Training',
      'Weight Loss'
    ]
  }],
  languages: [String],
  availability: [availabilitySchema],
  img: String,
  socialMedia: {
    instagram: String,
    facebook: String,
    twitter: String,
    linkedin: String,
    youtube: String
  },
  achievements: [achievementSchema],
  specializations: [specializationSchema],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Fully Booked', 'On Leave', 'Inactive'],
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trainer', trainerSchema);