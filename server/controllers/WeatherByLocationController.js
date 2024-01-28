const WeatherModel = require("../models/WeatherModel");


const WeatherByLocationController = {
  async getWeatherByLocation(req, res) {
    try {
      const { lat, lon, units } = req.query;
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const weatherData = await WeatherModel.getWeatherByLocation(
        lat,
        lon,
        units,
        apiKey
      );
      res.json(weatherData);
    } catch (error) {
      res.status(500).send("Error fetching weather data");
    }
  },
};

module.exports = WeatherByLocationController;
