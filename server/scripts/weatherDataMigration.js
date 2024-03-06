const fs = require('fs');
const { parse } = require('csv-parse');
const WeatherData = require("../models/weatherData");
const path = require('path');

const csvFilePath = path.join(__dirname, '../data/Aggregated Data.csv');

const fileStream = fs.createReadStream(csvFilePath);

const parser = fileStream.pipe(parse({
  columns: true,
  skip_empty_lines: true
}));

parser.on('readable', async function() {
  let record;
  while ((record = parser.read()) !== null) {
    // Map the CSV fields to the WeatherData model fields
    const weatherData = {
      date: record.date,
      temp_mean: parseFloat(record.temp_mean),
      temp_min: parseFloat(record.temp_min),
      temp_max: parseFloat(record.temp_max),
      feels_like_mean: parseFloat(record.feels_like_mean),
      feels_like_min: parseFloat(record.feels_like_min),
      feels_like_max: parseFloat(record.feels_like_max),
      humidity_mean: parseFloat(record.humidity_mean),
      wind_speed_mean: parseFloat(record.wind_speed_mean),
      wind_speed_max: record.wind_speed_max === 'NaN' ? null : parseFloat(record.wind_speed_max),
      rain_sum: record.rain_sum === '' ? null : parseFloat(record.rain_sum),
      snow_sum: record.snow_sum === '' ? null : parseFloat(record.snow_sum),
      weather_main: record.weather_main,
      weather_description: record.weather_description,
      weather_icon: record.weather_icon,
    };

    try {
      await WeatherData.create(weatherData);
    } catch (err) {
      console.error('Error inserting record into database:', err);
      console.error('Problematic record:', record);
    }
  }
});

parser.on('end', () => {
  console.log('CSV file processing completed.');
});

parser.on('error', (err) => {
  console.error('Error processing CSV file:', err);
});