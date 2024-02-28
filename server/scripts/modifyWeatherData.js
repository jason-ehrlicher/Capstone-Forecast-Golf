const fs = require('fs');
const { stringify } = require('csv-stringify');


const { parse } = require('csv-parse/sync');

const path = require('path');

// Path to your CSV file
const csvFilePath = path.join(__dirname, '../data/RecentWeather.csv');

// Read the CSV file
const csvData = fs.readFileSync(csvFilePath, 'utf8');

// Parse the CSV data
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true
});

// Modify the records as needed, here's an example of adding a new field
const modifiedRecords = records.map(record => {
  const [date, time] = record.dt_iso.split(' ');
  return { ...record, date, time };
});

// Define the columns to be written to the new CSV, including the new fields
const columns = {
  dt: 'dt',
  dt_iso: 'dt_iso',
  temp: 'temp',
  dew_point: 'dew_point',
  feels_like: 'feels_like',
  temp_min: 'temp_min',
  temp_max: 'temp_max',
  pressure: 'pressure',
  humidity: 'humidity',
  wind_speed: 'wind_speed',
  wind_deg: 'wind_deg',
  wind_gust: 'wind_gust',
  rain_1h: 'rain_1h',
  snow_1h: 'snow_1h',
  clouds_all: 'clouds_all',
  weather_id: 'weather_id',
  weather_main: 'weather_main',
  weather_description: 'weather_description',
  weather_icon: 'weather_icon',
  date: 'date', // New field
  time: 'time'  // New field
};

// Stringify the modified records and write them to a new file
stringify(modifiedRecords, { header: true, columns: columns }, (err, output) => {
  if (err) {
    console.error('Error stringifying CSV data:', err);
    return;
  }
  // Write to the same file to overwrite it, or specify a new file name
  fs.writeFileSync('/Users/jasonehrlicher/git/Mini-Project-II/server/data/Formatted Historical Weather Data.csv', output);
});
