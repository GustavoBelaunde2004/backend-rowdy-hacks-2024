const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  user: { type: String, required: true },  // Store user ID as a string (UUID)
  date: { type: String, required: true },    // Date for the specific entry
  heartRate: Number,
  steps: Number,
  calorie: Number,
  water: Number,
  sleep: Number,
  stress: Number
});

module.exports = mongoose.model('Data', dataSchema);
