const express = require('express');
const axios = require('axios');  // For making requests to the Flask API (TensorFlow)
const OpenAI = require('openai');  // Import the new OpenAI API client
const router = express.Router();
const Data = require('../models/Data');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");  // Use session middleware

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // OpenAI API key from the .env file
});
console.log("Openai connection succesful")

// UPLOAD USERS INFO
router.post('/data', async (req, res) => {
  try {
    const { user, healthData } = req.body;

    if (!user || !healthData) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure healthData is an array (or wrap it in an array if it's a single object)
    const dataEntries = Array.isArray(healthData) ? healthData : [healthData];

    for (const dayData of dataEntries) {
      const date = new Date(dayData.date);

      // Validate the date format
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format for entry: ${dayData.date}`);
      }

      // Ensure the date is not in the future
      const today = new Date();
      if (date > today) {
        throw new Error(`Date cannot be in the future: ${dayData.date}`);
      }

      // Convert all health metrics to numbers before storing them
      const heartRate = Number(dayData.heartRate);
      const steps = Number(dayData.steps);
      const calorie = Number(dayData.calorie);
      const water = Number(dayData.water);
      const sleep = Number(dayData.sleep);
      const stress = Number(dayData.stress);

      // Find if data already exists for this user and this date
      const existingData = await Data.findOne({ user: user, date: date });

      if (existingData) {
        // If data exists for this user and date, update it with the new values
        existingData.heartRate = heartRate;
        existingData.steps = steps;
        existingData.calorie = calorie;
        existingData.water = water;
        existingData.sleep = sleep;
        existingData.stress = stress;

        await existingData.save();
      } else {
        // Create new entry if no existing data
        const newData = new Data({
          user: user,
          date: date,
          heartRate,
          steps,
          calorie,
          water,
          sleep,
          stress
        });

        await newData.save();
      }
    }

    res.status(201).send('Health data added/updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error: ${error.message}`);
  }
});


// RETRIEVES AND ANALYZES INFO USING AI
router.get('/analyze', async (req, res) => {
  console.log(req)
  try {
    const username = req.query.username;  // Get the username from query params

    console.log("username: " + username)

    // Ensure username is provided
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Retrieve all the user's health data based on username
    const userData = await Data.find({ user: username }).sort({ date: 1 });

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: 'No health data found for this user' });
    }

    // Calculate average metrics (e.g., sleep, heart rate, steps)
    const avgSleep = calculateAverage(userData, 'sleep');
    const avgHeartRate = calculateAverage(userData, 'heartRate');
    const avgSteps = calculateAverage(userData, 'steps');
    const avgWater = calculateAverage(userData, 'water');
    const avgCal = calculateAverage(userData, 'calorie');

    // 1. Send data to TensorFlow model Flask API for stress level prediction
    const response = await axios.post('http://localhost:5001/predict', {
      sleep: avgSleep,
      heartRate: avgHeartRate,
      steps: avgSteps
    });

    // Get predicted stress level from Flask API
    const stressLevel = response.data.stress_level;

    // 2. Generate personalized recommendations using OpenAI API
    const recommendations = await generateRecommendationsUsingOpenAI({ avgSleep, avgHeartRate, avgSteps, stressLevel });

    // Send the analysis and prediction back to the frontend
    res.json({
      analysis: {
        avgSleep,
        avgHeartRate,
        avgSteps,
        stressLevel,
        avgWater,
        avgCal,
        recommendations  // Output personalized recommendations
      }
    });
  } catch (error) {
    console.error('Error analyzing health data:', error);  // Log full error details
    res.status(500).send(`Error analyzing health data: ${error.message}`);
  }
});


// Function to generate recommendations using OpenAI API
async function generateRecommendationsUsingOpenAI(analysis) {
  const prompt = `
    A user has the following health data:
    - Average sleep: ${analysis.avgSleep} hours
    - Average heart rate: ${analysis.avgHeartRate} bpm
    - Average steps: ${analysis.avgSteps} steps
    - Stress level: ${analysis.stressLevel}

    Based on this data, generate personalized health and wellness recommendations to improve their lifestyle and reduce stress. Please make sure to add new line characters in your ouput after bullet points. I would like this data to be concise (less than 800).
  `;
  console.log("2")
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt }
    ],
    max_tokens: 150

  });
  console.log("3")

  return completion.choices[0].message.content.trim();
}

//function to calculate averages
function calculateAverage(data, field) {
  const total = data.reduce((sum, entry) => sum + entry[field], 0);
  return (total / data.length).toFixed(2);
}

module.exports = router;
