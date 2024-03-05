
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers');
const { getAverageRoundsForDay } = require('../controllers/predictionController'); // Adjust the path as necessary

router.post('/', getAverageRoundsForDay);

module.exports = router;
