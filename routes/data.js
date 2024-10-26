const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");  // Use session middleware

// UPLOAD USERS INFO
router.post('/data', verifySession(), async (req, res) => {
  try {
    const userId = req.session.getUserId();  // Get the logged-in user's ID from the session
    const { healthData } = req.body;

    // Ensure healthData is an array (or wrap it in an array if it's a single object)
    const dataEntries = Array.isArray(healthData) ? healthData : [healthData];

    for (const dayData of dataEntries) {
      const date = new Date(dayData.date);

      // Validate the date as you've already implemented
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format for entry: ${dayData.date}`);
      }

      // Ensure the date is not in the future
      const today = new Date();
      if (date > today) {
        throw new Error(`Date cannot be in the future: ${dayData.date}`);
      }

      // Find if data already exists for this user and this date
      const existingData = await Data.findOne({ user: userId, date: date });

      if (existingData) {
        // If data exists for this user and date, update it with the new values
        existingData.heartRate = dayData.heartRate;
        existingData.steps = dayData.steps;
        existingData.calorie = dayData.calorie;
        existingData.water = dayData.water;
        existingData.sleep = dayData.sleep;
        existingData.stress = dayData.stress;

        await existingData.save();  // Save the updated data
      } else {
        // If no existing data, create a new entry
        const newData = new Data({
          user: userId,
          date: date,
          heartRate: dayData.heartRate,
          steps: dayData.steps,
          calorie: dayData.calorie,
          water: dayData.water,
          sleep: dayData.sleep,
          stress: dayData.stress
        });

        await newData.save();  // Save the new entry
      }
    }

    res.status(201).send('Health data added/updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// RETRIEVES AND ANALYZES INFO
router.get('/analyze', verifySession(), async (req, res) => {
  try {
    const userId = req.session.getUserId();  // Get the logged-in user's ID from the session

    // Retrieve all the user's health data
    const userData = await Data.find({ user: userId }).sort({ date: 1 });

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: 'No health data found for this user' });
    }

    // Perform analysis on the retrieved data
    const analysisResults = analyzeUserData(userData);

    // Send the analysis results back to the frontend
    res.status(200).json({
      message: 'Health data analyzed successfully',
      analysis: analysisResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error analyzing health data');
  }
});

// JUST RETRIEVE INFO!
router.get('/data', verifySession(), async (req, res) => {
  try {
    const userId = req.session.getUserId();  // Get the logged-in user's ID

    // Find all data for the logged-in user, exclude the `__v` field
    const healthData = await Data.find({ user: userId }, { __v: 0 }).sort({ date: 1 });

    // Restructure the response to include the user and group the entries by date
    const response = {
      user: userId,
      entries: healthData.map(entry => ({
        date: entry.date,
        heartRate: entry.heartRate,
        steps: entry.steps,
        calorie: entry.calorie,
        water: entry.water,
        sleep: entry.sleep,
        stress: entry.stress
      }))
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving health data');
  }
});

// ANALYSIS FUNCTION (BETA)
function analyzeUserData(userData) {
  const totalDays = userData.length;
  
  // Total values
  const totalSleep = userData.reduce((sum, entry) => sum + entry.sleep, 0);
  const totalSteps = userData.reduce((sum, entry) => sum + entry.steps, 0);
  const totalHeartRate = userData.reduce((sum, entry) => sum + entry.heartRate, 0);
  
  // Average calculations
  const avgSleep = (totalSleep / totalDays).toFixed(2);
  const avgSteps = (totalSteps / totalDays).toFixed(0);
  const avgHeartRate = (totalHeartRate / totalDays).toFixed(2);

  // Additional insights (e.g., max, min)
  const maxSleep = Math.max(...userData.map(entry => entry.sleep));
  const minSleep = Math.min(...userData.map(entry => entry.sleep));

  const maxSteps = Math.max(...userData.map(entry => entry.steps));
  const minSteps = Math.min(...userData.map(entry => entry.steps));

  // Return the analysis results
  return {
    averageSleep: `${avgSleep} hours`,
    maxSleep: `${maxSleep} hours`,
    minSleep: `${minSleep} hours`,
    
    averageSteps: `${avgSteps} steps`,
    maxSteps: `${maxSteps} steps`,
    minSteps: `${minSteps} steps`,

    averageHeartRate: `${avgHeartRate} bpm`
  };
}


module.exports = router;
