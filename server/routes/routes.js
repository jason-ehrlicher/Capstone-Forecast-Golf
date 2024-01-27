const express = require("express");
const WeatherController = require("./controllers/WeatherController");
const RoundsPlayedController = require("./controllers/RoundsPlayedController");

const router = express.Router();

// Define routes
router.get("/weather", WeatherController.getWeatherData);
router.get("/rounds-played", RoundsPlayedController.getRoundsPlayedData);

module.exports = router;
