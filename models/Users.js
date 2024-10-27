// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },  // If you're storing passwords (hashed)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users', userSchema);
