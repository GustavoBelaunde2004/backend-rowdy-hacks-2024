const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  user: { type: String, required: true },  // Store user ID as a string (UUID)
  date: { type: String, required: true },    // Date for the specific entry
  heartRate: String,
  steps: String,
  calorie: String,
  water: String,
  sleep: String,
  stress: String
});

module.exports = mongoose.model('Data', dataSchema);
