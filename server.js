const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const supertokens = require("supertokens-node");
const { middleware, errorHandler } = require("supertokens-node/framework/express");
const { verifySession } = require("supertokens-node/recipe/session/framework/express");  // Correct import
require("./config/supertokensConfig");  // Import the Supertokens config

const app = express();

// Ensure CORS settings allow credentials (cookies)
app.use(cors({
    origin: 'http://localhost:3000',  // Your React frontend URL
    credentials: true  // Allows cookies and session information to be passed
}));

// Enable JSON parsing
app.use(express.json());

// Supertokens middleware (ensure it's after CORS)
app.use(middleware());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Health data routes (this is your custom logic for handling health data)
const dataRoutes = require('./routes/data');
app.use('/api/health', dataRoutes);

const userRoutes = require('./routes/users');  // Import the route you just created
app.use('/api', userRoutes);  // Register the route with the base `/api`

// Example of a protected route (user must be logged in to access)
app.get("/dashboard", verifySession(), (req, res) => {
  res.send("This is a protected dashboard route, only accessible when logged in!");
});

// Supertokens error handling middleware (must be after all routes)
app.use(errorHandler());  // Handles Supertokens-related errors

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
