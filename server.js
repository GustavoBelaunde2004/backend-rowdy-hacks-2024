const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const supertokens = require("supertokens-node");
const { middleware, errorHandler } = require("supertokens-node/framework/express");
const { verifySession } = require("supertokens-node/recipe/session/framework/express");  // Correct import
require("./config/supertokensConfig");  // Import the Supertokens config

const app = express();
app.use(cors());
app.use(express.json());

// Supertokens middleware for handling authentication routes
app.use(middleware());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Use health data routes
const dataRoutes = require('./routes/data');
app.use('/api/health', dataRoutes);

// Example of a protected route (user must be logged in to access)
app.get("/dashboard", verifySession(), (req, res) => {
  res.send("This is a protected dashboard route, only accessible when logged in!");
});

// Supertokens error handling
app.use(errorHandler());  // Handles Supertokens-related errors

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
