const fetch = require("node-fetch");

const getWeatherByLocation = async (lat, lon, units, apiKey) => {
  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Rethrow the error for the controller to handle
  }
};

module.exports = { getWeatherByLocation };
