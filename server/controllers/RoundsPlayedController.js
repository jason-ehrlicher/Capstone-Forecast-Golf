const { readRoundsPlayed, mergeData } = require("../models/RoundsPlayedModel");
const processFile = require("../models/WeatherDataModel");
const path = require("path");

const RoundsPlayedController = {
  async getRoundsPlayedData(req, res) {
    try {
      // Construct the absolute paths for the CSV files
      const weatherFilePath = path.join(__dirname, '../data/Historical Weather Data.csv');
      const roundsPlayedFilePath = path.join(__dirname, '../data/Rounds Played copy.csv');
      

      // Log the resolved file paths
      console.log("Weather File Path:", weatherFilePath);
      console.log("Rounds Played File Path:", roundsPlayedFilePath);

      const weatherData = await processFile(weatherFilePath);
      const roundsPlayedData = await readRoundsPlayed(roundsPlayedFilePath);

      if (!weatherData || !roundsPlayedData) {
        throw new Error("Failed to process data.");
      }

      const combinedData = mergeData(weatherData, roundsPlayedData);
      res.json(combinedData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing rounds played data");
    }
  },
};

module.exports = RoundsPlayedController;
