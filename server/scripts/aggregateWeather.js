const fs = require('fs');
const csv = require('csv-parse');

const inputFile = '/Users/jasonehrlicher/git/Mini-Project-II/server/data/Formatted Historical Weather Data.csv';
const outputFile = '/Users/jasonehrlicher/git/Mini-Project-II/server/data/Aggregated Data.csv';

// Read the CSV data from the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading CSV file:', err);
    return;
  }

  // Parse the CSV data
  csv.parse(data, (err, records) => {
    if (err) {
      console.error('Error parsing CSV data:', err);
      return;
    }

    // Get the column names from the first record
    const headers = records[0];
    const dateIndex = headers.indexOf('date');
    const tempIndex = headers.indexOf('temp');
    const feelsLikeIndex = headers.indexOf('feels_like');
    const humidityIndex = headers.indexOf('humidity');
    const windSpeedIndex = headers.indexOf('wind_speed');
    const windGustIndex = headers.indexOf('wind_gust');
    const rainIndex = headers.indexOf('rain_1h');
    const snowIndex = headers.indexOf('snow_1h');
    const weatherMainIndex = headers.indexOf('weather_main');
    const weatherDescriptionIndex = headers.indexOf('weather_description');
    const weatherIconIndex = headers.indexOf('weather_icon');

    // Remove the header record from the records array
    records.shift();

    // Create an object to store the aggregated data
    const aggregatedData = {};

    // Iterate over each record
    records.forEach(record => {
      const date = record[dateIndex];

      // Initialize the aggregated data for the date if it doesn't exist
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          temp: [],
          feelsLike: [],
          humidity: [],
          windSpeed: [],
          windGust: [],
          rain: 0,
          snow: 0,
          weatherMain: {},
          weatherDescription: {},
          weatherIcon: {},
        };
      }

      // Aggregate the data for each field
      aggregatedData[date].temp.push(parseFloat(record[tempIndex]));
      aggregatedData[date].feelsLike.push(parseFloat(record[feelsLikeIndex]));
      aggregatedData[date].humidity.push(parseFloat(record[humidityIndex]));
      aggregatedData[date].windSpeed.push(parseFloat(record[windSpeedIndex]));
      aggregatedData[date].windGust.push(parseFloat(record[windGustIndex]));
      aggregatedData[date].rain += parseFloat(record[rainIndex] || 0);
      aggregatedData[date].snow += parseFloat(record[snowIndex] || 0);

      const weatherMain = record[weatherMainIndex];
      aggregatedData[date].weatherMain[weatherMain] = (aggregatedData[date].weatherMain[weatherMain] || 0) + 1;

      const weatherDescription = record[weatherDescriptionIndex];
      aggregatedData[date].weatherDescription[weatherDescription] = (aggregatedData[date].weatherDescription[weatherDescription] || 0) + 1;

      const weatherIcon = record[weatherIconIndex];
      aggregatedData[date].weatherIcon[weatherIcon] = (aggregatedData[date].weatherIcon[weatherIcon] || 0) + 1;
    });

    // Create an array to store the final aggregated data
    const finalData = [];

    // Iterate over the aggregated data and calculate the final statistics
    for (const date in aggregatedData) {
      const tempData = aggregatedData[date].temp;
      const feelsLikeData = aggregatedData[date].feelsLike;
      const humidityData = aggregatedData[date].humidity;
      const windSpeedData = aggregatedData[date].windSpeed;
      const windGustData = aggregatedData[date].windGust;
      const weatherMainData = aggregatedData[date].weatherMain;
      const weatherDescriptionData = aggregatedData[date].weatherDescription;
      const weatherIconData = aggregatedData[date].weatherIcon;

      const aggregatedRecord = [
        date,
        average(tempData),
        Math.min(...tempData),
        Math.max(...tempData),
        average(feelsLikeData),
        Math.min(...feelsLikeData),
        Math.max(...feelsLikeData),
        average(humidityData),
        average(windSpeedData),
        Math.max(...windGustData),
        aggregatedData[date].rain,
        aggregatedData[date].snow,
        Object.keys(weatherMainData).reduce((a, b) => weatherMainData[a] > weatherMainData[b] ? a : b),
        Object.keys(weatherDescriptionData).reduce((a, b) => weatherDescriptionData[a] > weatherDescriptionData[b] ? a : b),
        Object.keys(weatherIconData).reduce((a, b) => weatherIconData[a] > weatherIconData[b] ? a : b),
      ];

      finalData.push(aggregatedRecord);
    }

    // Convert the final data to CSV format
    const csvData = [
      ['date', 'temp_mean', 'temp_min', 'temp_max', 'feels_like_mean', 'feels_like_min', 'feels_like_max', 'humidity_mean', 'wind_speed_mean', 'wind_speed_max', 'rain_sum', 'snow_sum', 'weather_main', 'weather_description', 'weather_icon'],
      ...finalData
    ].map(row => row.join(',')).join('\n');

    // Write the aggregated data to the output file
    fs.writeFile(outputFile, csvData, err => {
      if (err) {
        console.error('Error writing aggregated data to CSV:', err);
      } else {
        console.log('Aggregated data saved to', outputFile);
      }
    });
  });
});

// Helper function to calculate the average of an array
function average(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}