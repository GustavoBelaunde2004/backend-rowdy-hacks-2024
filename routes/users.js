const express = require('express');
const router = express.Router();
const User = require('../models/Users');  // Assuming User model is correctly defined

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});  // Retrieve all users
    res.status(200).json(users);  // Send the users back in JSON format
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
