const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Can be userID or username
  date: { type: Date, required: true }, // Date for the specific entry
  heartRate: Number,
  steps: Number,
  calorie: Number,
  water: Number,
  sleep: Number,
  stress: Number
});


module.exports = mongoose.model('data', dataSchema);
