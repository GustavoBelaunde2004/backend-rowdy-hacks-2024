const express = require('express');
const router = express.Router();
//const data = require('../models/Data');
const Data = require('../models/Data');

//UPLOAD USERS INFO
router.post('/data', async (req, res) => {
  try {
    const { user, healthData } = req.body;

    // Ensure healthData is an array (or wrap it in an array if it's a single object)
    const dataEntries = Array.isArray(healthData) ? healthData : [healthData];

    for (const dayData of dataEntries) {
      const date = new Date(dayData.date);

      // Validate the date as you've already implemented
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format for entry: ${dayData.date}`);
      }

      // Optional: Ensure the date is not in the future
      const today = new Date();
      if (date > today) {
        throw new Error(`Date cannot be in the future: ${dayData.date}`);
      }

      // Find if data already exists for this user and this date
      const existingData = await Data.findOne({ user: user, date: date });

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
          user: user,
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


// RETRIVES AND ANLYZES INFO
router.get('/analyze/:user', async (req, res) => {
  try {
    const { user } = req.params;

    // Retrieve all the user's health data
    const userData = await Data.find({ user }).sort({ date: 1 });

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

// ANALYSIS FUNCTION (BETA)
function analyzeUserData(userData) {
  const totalDays = userData.length;
  const totalSleep = userData.reduce((sum, entry) => sum + entry.sleep, 0);
  const totalSteps = userData.reduce((sum, entry) => sum + entry.steps, 0);
  const totalHeartRate = userData.reduce((sum, entry) => sum + entry.heartRate, 0);

  const avgSleep = (totalSleep / totalDays).toFixed(2);
  const avgSteps = (totalSteps / totalDays).toFixed(0);
  const avgHeartRate = (totalHeartRate / totalDays).toFixed(2);

  // You can expand this analysis with more insights if needed
  return {
    averageSleep: `${avgSleep} hours`,
    averageSteps: `${avgSteps} steps`,
    averageHeartRate: `${avgHeartRate} bpm`
  };
}


//JUST RETRIVE INFO!
router.get('/data/:user', async (req, res) => {
  try {
    const { user } = req.params;

    // Find all data for the given user, exclude the `__v` field
    const healthData = await Data.find({ user }, { __v: 0 }).sort({ date: 1 });

    // Restructure the response to include the user and group the entries by date
    const response = {
      user: user,
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



module.exports = router;