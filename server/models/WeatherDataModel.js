const fs = require("fs");
const readline = require("readline");

// formats historical weather data

// Function to process the file
async function processFile(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let dailyWeather = {};
  for await (const line of rl) {
    // Skip the header line
    if (line.startsWith("dt")) continue;

    // Split line into columns
    const cols = line.split(",");
    if (cols.length < 19) {
      console.error("Unexpected format in line:", line);
      continue; // Skip this line due to unexpected format
    }

    const dateTime = cols[1];
    if (!dateTime) {
      console.error("DateTime is undefined in line:", line);
      continue; // Skip this line due to missing dateTime
    }

    const date = dateTime.split(" ")[0]; // Get only the date part
    const time = dateTime.split(" ")[1]; // Get only the time part
    const temp = parseFloat(cols[2]);
    const dewPoint = parseFloat(cols[3]);
    const feelsLike = parseFloat(cols[4]);
    const tempMin = parseFloat(cols[5]);
    const tempMax = parseFloat(cols[6]);
    const pressure = parseFloat(cols[7]);
    const humidity = parseFloat(cols[8]);
    const windSpeed = parseFloat(cols[9]);
    const windDeg = parseFloat(cols[10]);
    const windGust = parseFloat(cols[11]);
    const rain = parseFloat(cols[12]) || 0; // Handling missing or non-numeric values
    const snow = parseFloat(cols[13]) || 0; // Handling missing or non-numeric values

    if (!dailyWeather[date]) {
      dailyWeather[date] = {
        tempTotal: 0,
        dewPointTotal: 0,
        feelsLikeTotal: 0,
        tempMinTotal: 0,
        tempMaxTotal: 0,
        pressureTotal: 0,
        humidityTotal: 0,
        windSpeedTotal: 0,
        windDegTotal: 0,
        windGustTotal: 0,
        count: 0,
        rainTotal: 0,
        snowTotal: 0,
        weatherMain: "",
        weatherDescription: "",
        weatherIcon: "",
      };
    }
    dailyWeather[date].tempTotal += temp;
    dailyWeather[date].dewPointTotal += dewPoint;
    dailyWeather[date].feelsLikeTotal += feelsLike;
    dailyWeather[date].tempMinTotal += tempMin;
    dailyWeather[date].tempMaxTotal += tempMax;
    dailyWeather[date].pressureTotal += pressure;
    dailyWeather[date].humidityTotal += humidity;
    dailyWeather[date].windSpeedTotal += windSpeed;
    dailyWeather[date].windDegTotal += windDeg;
    dailyWeather[date].windGustTotal += windGust;
    dailyWeather[date].count++;
    dailyWeather[date].rainTotal += rain;
    dailyWeather[date].snowTotal += snow;

    // Extract weather details at 12:00
    if (time.startsWith("12:00")) {
      dailyWeather[date].weatherMain = cols[16];
      dailyWeather[date].weatherDescription = cols[17];
      dailyWeather[date].weatherIcon = cols[18];
    }
  }

  // Calculate averages and include weather details, exclude total fields
  let dailyWeatherProcessed = {};
  for (const date in dailyWeather) {
    const dayData = dailyWeather[date];
    dailyWeatherProcessed[date] = {
      averageTemp: +(dayData.tempTotal / dayData.count).toFixed(1),
      averageDewPoint: +(dayData.dewPointTotal / dayData.count).toFixed(1),
      averageFeelsLike: +(dayData.feelsLikeTotal / dayData.count).toFixed(1),
      averageTempMin: +(dayData.tempMinTotal / dayData.count).toFixed(1),
      averageTempMax: +(dayData.tempMaxTotal / dayData.count).toFixed(1),
      averagePressure: +(dayData.pressureTotal / dayData.count).toFixed(1),
      averageHumidity: +(dayData.humidityTotal / dayData.count).toFixed(1),
      averageWindSpeed: +(dayData.windSpeedTotal / dayData.count).toFixed(1),
      averageWindDeg: +(dayData.windDegTotal / dayData.count).toFixed(1),
      averageWindGust: +(dayData.windGustTotal / dayData.count).toFixed(1),
      rainTotal: +dayData.rainTotal.toFixed(1),
      snowTotal: +dayData.snowTotal.toFixed(1),
      weatherMain: dayData.weatherMain,
      weatherDescription: dayData.weatherDescription,
      weatherIcon: dayData.weatherIcon,
    };
  }

  // console.log("Processed weather data:", dailyWeatherProcessed);
  return dailyWeatherProcessed;
}

module.exports = processFile;
