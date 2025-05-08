const Trainer = require('../models/Trainer');
const fs = require('fs'); // Required for file system operations if deleting old images
const path = require('path'); // Required for path manipulation

// Helper function to safely parse JSON strings from FormData
const parseJsonField = (fieldValue) => {
  if (typeof fieldValue === 'string') {
    try {
      return JSON.parse(fieldValue);
    } catch (e) {
      // If parsing fails, return the original string or handle as needed
      console.warn("Failed to parse JSON field:", fieldValue, e);
      return fieldValue; // Or return null, or throw error depending on requirements
    }
  }
  return fieldValue; // Return as is if not a string
};

// --- Add Schedule Parsing Function ---
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning', 'Afternoon', 'Evening']; // Match frontend/schema

const parseScheduleToAvailability = (scheduleString) => {
  if (!scheduleString || typeof scheduleString !== 'string') return []; // Return empty array if no string

  const availabilityMap = {};
  daysOfWeek.forEach(day => availabilityMap[day] = []); // Initialize map

  const lines = scheduleString.split('\n');
  lines.forEach(line => {
    const parts = line.split(':');
    if (parts.length === 2) {
      const day = parts[0].trim();
      const slots = parts[1].split(',')
                           .map(s => s.trim())
                           .filter(s => timeSlots.includes(s)); // Validate slots
      if (daysOfWeek.includes(day)) {
        availabilityMap[day] = slots;
      }
    }
  });

  // Convert map to the array structure expected by the schema
  const availabilityArray = daysOfWeek
    .filter(day => availabilityMap[day].length > 0) // Only include days with slots
    .map(day => ({
      day: day,
      slots: availabilityMap[day]
    }));

  return availabilityArray;
};
// --- End Schedule Parsing Function ---

// Get all trainers
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single trainer
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }
    res.json(trainer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create trainer
exports.createTrainer = async (req, res) => {
  console.log("--- Create Trainer Request Received ---");
  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);

  try {
    const trainerData = { ...req.body };
    console.log("Initial trainerData from body:", JSON.stringify(trainerData));

    // Parse fields that were stringified in FormData
    try {
      const fieldsToParse = [
        'specialty', 'expertise', 'qualifications', 'socialMedia',
        'certifications', 'languages', 'achievements', 'specializations', 'rating'
      ];
      fieldsToParse.forEach(field => {
        if (trainerData[field]) {
          trainerData[field] = parseJsonField(trainerData[field]);
          console.log(`Parsed ${field}:`, trainerData[field]);
        }
      });
    } catch (parseError) {
      console.error("Error parsing JSON fields from req.body:", parseError);
      // Decide how to handle parse errors - maybe return 400?
      return res.status(400).json({ success: false, message: "Invalid format for array/object fields.", error: parseError.message });
    }

    // --- Handle Schedule/Availability ---
    if (trainerData.schedule) {
      console.log("Parsing schedule string:", trainerData.schedule);
      trainerData.availability = parseScheduleToAvailability(trainerData.schedule);
      console.log("Parsed availability:", JSON.stringify(trainerData.availability, null, 2));
      delete trainerData.schedule; // Remove the original string field before saving
    } else {
      // If no schedule string is provided, ensure availability is not accidentally set from body
      delete trainerData.availability;
    }
    // --- End Handle Schedule/Availability ---

    // Add image path if uploaded
    if (req.file) {
      trainerData.img = `/uploads/trainers/${req.file.filename}`;
      console.log("Image path added:", trainerData.img);
    } else {
      console.log("No image file uploaded.");
    }

    // Ensure boolean fields are correctly interpreted
    if (trainerData.active) trainerData.active = trainerData.active === 'true';
    if (trainerData.featured) trainerData.featured = trainerData.featured === 'true';
    console.log("Processed Booleans - Active:", trainerData.active, "Featured:", trainerData.featured);

    // Remove fields that shouldn't be saved directly if they came from req.body
    delete trainerData._id; // Never save _id on create
    delete trainerData.__v;
    delete trainerData.createdAt; // Let mongoose handle this

    console.log("Final trainerData before create:", JSON.stringify(trainerData, null, 2)); // Pretty print

    console.log("Attempting Trainer.create...");
    const trainer = await Trainer.create(trainerData);
    console.log("Trainer created successfully:", trainer._id);

    res.status(201).json(trainer);

  } catch (error) {
    console.error("--- ERROR in createTrainer ---:", error); // Log the full error object
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.stack) {
        console.error("Error Stack:", error.stack);
    }

    // Handle potential file cleanup if creation fails after upload
    if (req.file && req.file.path) {
      console.log("Attempting to delete uploaded file due to error:", req.file.path);
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting uploaded file after failed creation:", err);
        else console.log("Uploaded file deleted successfully after error.");
      });
    }

    // Send specific validation errors if available
    if (error.name === 'ValidationError') {
        console.log("Validation Error Details:", error.errors);
        return res.status(400).json({
            success: false,
            message: error.message, // Mongoose provides a combined message
            errors: error.errors // Specific field errors
        });
    }

    // Generic Internal Server Error for other issues
    res.status(500).json({ // Use 500 for unexpected server errors
      success: false,
      message: 'Internal server error occurred while creating trainer.', // More specific generic message
      // Optionally include error details in development mode only
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
  console.log("--- Update Trainer Request Received ---");
  console.log("Trainer ID:", req.params.id);
  console.log("Request Body:", JSON.stringify(req.body, null, 2)); // Log stringified body
  console.log("Request File:", req.file);

  const trainerId = req.params.id; // Define trainerId early

  try {
    const updateData = { ...req.body };
    let oldImagePath = null;
    let absoluteOldImagePath = null; // For deletion

    console.log("Initial updateData from body:", JSON.stringify(updateData));

    // Find existing trainer
    console.log(`Finding trainer with ID: ${trainerId}`);
    const existingTrainer = await Trainer.findById(trainerId);
    if (!existingTrainer) {
      console.log("Trainer not found.");
      // Clean up uploaded file if trainer not found
      if (req.file && req.file.path) {
        console.log("Deleting uploaded file for non-existent trainer:", req.file.path);
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting uploaded file for non-existent trainer:", err);
        });
      }
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    console.log("Found existing trainer.");
    if (existingTrainer.img) {
        oldImagePath = existingTrainer.img; // Relative path stored in DB (e.g., /uploads/trainers/...)
        // Construct the absolute path for deletion
        // Assuming 'uploads' is directly inside the 'backend' folder
        absoluteOldImagePath = path.join(__dirname, '..', 'uploads', 'trainers', path.basename(oldImagePath));
        console.log(`Existing image path (relative): ${oldImagePath}`);
        console.log(`Constructed absolute path for deletion: ${absoluteOldImagePath}`); // Log the path
    }

    // Parse fields
    try {
      const fieldsToParse = [
        'specialty', 'expertise', 'qualifications', 'socialMedia',
        'certifications', 'languages', 'achievements', 'specializations', 'rating'
      ];
      fieldsToParse.forEach(field => {
        if (updateData[field] !== undefined) { // Check existence before parsing
          updateData[field] = parseJsonField(updateData[field]);
          console.log(`Parsed ${field} for update:`, updateData[field]);
        }
      });
    } catch (parseError) {
      console.error("Error parsing JSON fields from req.body:", parseError);
      return res.status(400).json({ success: false, message: "Invalid format for array/object fields.", error: parseError.message });
    }

    // --- Handle Schedule/Availability ---
    if (updateData.schedule !== undefined) { // Check if schedule field exists in the request
        console.log("Parsing schedule string for update:", updateData.schedule);
        updateData.availability = parseScheduleToAvailability(updateData.schedule);
        console.log("Parsed availability for update:", JSON.stringify(updateData.availability, null, 2));
        delete updateData.schedule; // Remove the original string field before updating
    } else {
        // If schedule string is not part of the update, remove availability to avoid accidental overwrite
        delete updateData.availability;
        console.log("No schedule string in update request, availability field removed from updateData.");
    }
    // --- End Handle Schedule/Availability ---

    // Handle image update/removal
    if (req.file) {
      updateData.img = `/uploads/trainers/${req.file.filename}`;
      console.log("New image path added:", updateData.img);
    } else if (updateData.img === 'null' || updateData.img === '') {
      console.log("Request to remove existing image.");
      updateData.img = null;
    } else {
      console.log("No new image uploaded or removal requested. Image field untouched in updateData.");
      delete updateData.img; // Ensure we don't overwrite with potentially stale data from body
    }

    // Handle booleans
    if (updateData.active !== undefined) updateData.active = String(updateData.active) === 'true';
    if (updateData.featured !== undefined) updateData.featured = String(updateData.featured) === 'true';
    console.log("Processed Booleans - Active:", updateData.active, "Featured:", updateData.featured);

    // Remove fields that should not be updated directly from req.body
    delete updateData._id; // Prevent changing the ID
    delete updateData.__v;
    delete updateData.createdAt;

    console.log("Final updateData before DB update:", JSON.stringify(updateData, null, 2)); // Log final data

    // --- Database Update ---
    console.log(`Attempting Trainer.findByIdAndUpdate for ID: ${trainerId}...`);
    let trainer; // Define trainer variable outside the immediate scope
    try {
        trainer = await Trainer.findByIdAndUpdate(
            trainerId,
            // Use $set to ensure only provided fields are updated and arrays are replaced correctly
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!trainer) {
             // Handle case where update returns null (e.g., ID not found after initial check - race condition?)
             console.log("Trainer not found during findByIdAndUpdate.");
             // Clean up uploaded file if necessary
             if (req.file && req.file.path) {
                 fs.unlink(req.file.path, (err) => { if (err) console.error("Error deleting uploaded file:", err); });
             }
             return res.status(404).json({ success: false, message: 'Trainer not found during update' });
        }
        console.log("Trainer.findByIdAndUpdate successful.");
    } catch (dbError) {
        console.error("--- ERROR during Trainer.findByIdAndUpdate ---");
        console.error("Database Error Name:", dbError.name);
        console.error("Database Error Message:", dbError.message);
        if (dbError.errors) { // Log validation errors specifically
            console.error("Validation Errors:", JSON.stringify(dbError.errors, null, 2));
        }
        if (dbError.stack) {
            console.error("Database Error Stack:", dbError.stack);
        }
        // Re-throw the error to be caught by the outer catch block
        throw dbError;
    }
    // --- End Database Update ---

    // --- Old Image Deletion Logic ---
    if (trainer && absoluteOldImagePath) { // Check if trainer update was successful
        // Condition 1: New image uploaded, delete old one
        if (req.file) {
            console.log(`Attempting to delete old image (due to new upload): ${absoluteOldImagePath}`);
            fs.access(absoluteOldImagePath, fs.constants.F_OK, (accessErr) => {
                if (!accessErr) {
                    console.log("Old image exists, proceeding with deletion.");
                    fs.unlink(absoluteOldImagePath, (unlinkErr) => {
                        if (unlinkErr) console.error(`Error deleting old trainer image (${absoluteOldImagePath}):`, unlinkErr);
                        else console.log(`Old trainer image (${absoluteOldImagePath}) deleted successfully.`);
                    });
                } else {
                    console.warn(`Old trainer image not found at ${absoluteOldImagePath}, skipping deletion.`);
                }
            });
        }
        // Condition 2: Image explicitly removed (updateData.img set to null), delete old one
        else if (updateData.img === null) {
             console.log(`Attempting to delete explicitly removed image: ${absoluteOldImagePath}`);
             fs.access(absoluteOldImagePath, fs.constants.F_OK, (accessErr) => {
                if (!accessErr) {
                    console.log("Image for removal exists, proceeding with deletion.");
                    fs.unlink(absoluteOldImagePath, (unlinkErr) => {
                        if (unlinkErr) console.error(`Error deleting removed trainer image (${absoluteOldImagePath}):`, unlinkErr);
                        else console.log(`Explicitly removed trainer image (${absoluteOldImagePath}) deleted successfully.`);
                    });
                } else {
                     console.warn(`Image for removal not found at ${absoluteOldImagePath}, skipping deletion.`);
                }
            });
        }
    } else if (trainer && !absoluteOldImagePath && (req.file || updateData.img === null)) {
        console.log("Trainer updated, but no old image path was recorded. No deletion needed.");
    }
    // --- End Old Image Deletion Logic ---

    console.log("Update process completed successfully. Sending response.");
    res.json(trainer); // Send back the updated trainer

  } catch (error) { // Outer catch block
    console.error("--- ERROR in updateTrainer (Outer Catch Block) ---");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.stack) {
        console.error("Error Stack:", error.stack);
    }

    // File cleanup if a new file was uploaded during the failed request
    if (req.file && req.file.path) {
      console.log("Attempting to delete uploaded file due to error in outer catch block:", req.file.path);
       fs.access(req.file.path, fs.constants.F_OK, (err) => { // Use req.file.path directly
            if (!err) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting uploaded file after failed update:", unlinkErr);
                    else console.log("Uploaded file deleted successfully after error.");
                });
            } else {
                console.warn("Uploaded file not found for deletion after error:", req.file.path);
            }
        });
    }

    // Determine response status based on error type
    if (error.name === 'ValidationError') {
      console.log("Responding with 400 Validation Error.");
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    } else if (error.message === 'Trainer not found') {
        console.log("Responding with 404 Not Found.");
        return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    // Generic Internal Server Error for all other cases
    console.log("Responding with 500 Internal Server Error.");
    res.status(500).json({
      success: false,
      message: 'Internal server error during update.', // Keep generic message for client
      // Optionally include error details in development mode only
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle trainer status
exports.toggleStatus = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }
    
    trainer.active = !trainer.active;
    await trainer.save();
    
    res.json(trainer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};