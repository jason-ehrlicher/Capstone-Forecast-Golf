const fetch = require('node-fetch');
const { mergeData } = require("../models/RoundsPlayedModel");

const RoundsPlayedController = {
  async getRoundsPlayedData(req, res) {
    try {
      // Fetch rounds played data from API
      const roundsPlayedData = await fetch('http://localhost:8082/api/dailyRounds')
        .then(response => response.json());

      // Fetch weather data from API
      const weatherData = await fetch('http://localhost:8082/api/weatherData')
        .then(response => response.json());

      if (!weatherData || !roundsPlayedData) {
        throw new Error("Failed to fetch data from APIs.");
      }

      const combinedData = mergeData(weatherData, roundsPlayedData);
      res.json(combinedData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching rounds played data");
    }
  },
};

module.exports = RoundsPlayedController;
