const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs'); // Import fs module

// Load env vars
dotenv.config();

// --- Ensure upload directory exists ---
const uploadDir = path.join(__dirname, 'uploads', 'trainers');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
}
// --- End Ensure upload directory exists ---

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// --- Serve Static Files ---
// Make the 'uploads' directory publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// --- End Serve Static Files ---

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/appointments', require('./routes/appointments')); // Add appointments routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});