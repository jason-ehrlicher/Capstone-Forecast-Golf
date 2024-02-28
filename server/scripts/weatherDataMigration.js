const fs = require("fs");
const path = require("path"); 
const WeatherData = require("../models/weatherData");
const jsonFilePath = path.join(__dirname, "../data/Historical Weather.json");

// Function to read and insert data from JSON to MySQL
async function insertDataFromJSON(jsonFilePath) {
  try {
    const rawData = fs.readFileSync(jsonFilePath);
    const weatherData = JSON.parse(rawData);

    for (const item of weatherData) {
      await WeatherData.create({
        dt: item.dt,
        dt_iso: item.dt_iso,
        timezone: item.timezone,
        temp: item.main.temp,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        feels_like: item.main.feels_like,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        dew_point: item.main.dew_point,
        clouds_all: item.clouds.all,
        weather_id: item.weather[0].id,
        weather_main: item.weather[0].main,
        weather_description: item.weather[0].description,
        weather_icon: item.weather[0].icon,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        wind_gust: item.wind.gust,
        lon: item.lon,
        lat: item.lat,
        city_name: item.city_name,
      });
    }

    console.log("Data import complete");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

insertDataFromJSON(jsonFilePath);
