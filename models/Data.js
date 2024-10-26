const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  //username: { type: String, required: true, unique: true },
  //email: { type: String, required: true, unique: true },
  //password: { type: String, required: true },
      date: { type: Date, default: Date.now },
      heartRate: Number,
      steps: Number,
      calorie: Number,
      water: Number,
      sleep: Number,
      stress: Number
});

module.exports = mongoose.model('data', dataSchema);
