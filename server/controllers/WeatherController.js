const WeatherDataModel = require('../models/WeatherDataModel');

const WeatherController = {
    async getWeatherData(req, res) {
        try {
            const weatherData = await WeatherDataModel.processWeatherData();
            // Send the processed data to the client, or further manipulate it as required
            res.json(weatherData);
        } catch (error) {
            res.status(500).send('Error processing weather data');
        }
    }
};

module.exports = WeatherController;
