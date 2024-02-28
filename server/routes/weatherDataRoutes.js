const express = require('express');
const router = express.Router();
const weatherDataController = require('../controllers/weatherDataController');

// GET all weather data
// Example endpoint: http://localhost:8082/api/weatherData
router.get('/', weatherDataController.getWeatherData);

// GET weather data by date
// Example endpoint: http://localhost:8082/api/weatherData/date/2022-01-01
// router.get('/date/:date', weatherDataController.getWeatherDataByDate);

// POST create a new weather data record
// Example endpoint: http://localhost:8082/api/weatherData
router.post('/', weatherDataController.createWeatherData);

// PUT update an existing weather data record by ID
// Example endpoint: http://localhost:8082/api/weatherData/<id>
router.put('/:id', weatherDataController.updateWeatherData);

// DELETE a weather data record by ID
// Example endpoint: http://localhost:8082/api/weatherData/<id>
router.delete('/:id', weatherDataController.deleteWeatherData);

module.exports = router;
