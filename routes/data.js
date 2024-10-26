const express = require('express');
const router = express.Router();
const data = require('../models/Data');
const Data = require('../models/Data');

// Route to add health data
router.post('/data', async (req, res) => {
  try {
    console.log("h")
    const healthData = new Data({
      sleep: req.body.sleep,
      heartRate: req.body.heartRate,
      steps: req.body.steps,
      calorie: req.body.calorie,
      water: req.body.water,
      stress: req.body.stress
    });

    console.log(healthData)

    await healthData.save();
    res.status(201).send('Health data added');
  } catch (error) {
    res.status(500).send('Error saving health data');
  }
});

// Route to get health data
router.get('/data', async (req, res) => {
  try {
    const healthData = await Data.find({});
    res.json(healthData);
  } catch (error) {
    res.status(500).send('Error retrieving health data');
  }
});

module.exports = router;