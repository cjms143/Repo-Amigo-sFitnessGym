const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// --- Multer Configuration ---
// Define storage for the images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure this directory exists or create it beforehand
    cb(null, 'uploads/trainers/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename (e.g., fieldname-timestamp.extension)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Filter for image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer upload middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });
// --- End Multer Configuration ---


// Public routes
router.get('/', trainerController.getTrainers);
router.get('/:id', trainerController.getTrainer);

// Protected routes (admin only)
router.use(protect);

// Apply multer middleware only to routes that handle file uploads
router.post('/', upload.single('img'), trainerController.createTrainer); // Handles single file upload with field name 'img'
router.put('/:id', upload.single('img'), trainerController.updateTrainer); // Handles single file upload with field name 'img'

router.delete('/:id', trainerController.deleteTrainer);
router.patch('/:id/toggle-status', trainerController.toggleStatus);

module.exports = router;