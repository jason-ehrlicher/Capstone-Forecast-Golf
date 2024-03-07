const fs = require("fs");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");

const roundsPlayedPath =
  "/Users/jasonehrlicher/git/Mini-Project-II/server/data/Rounds Played copy.csv";
const weatherDataPath =
  "/Users/jasonehrlicher/git/Mini-Project-II/server/data/RecentWeather.csv";
const outputPath =
  "/Users/jasonehrlicher/git/Mini-Project-II/server/data/Data Range.csv";

// Helper function to read and parse CSV asynchronously
function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        return reject(err);
      }
      parse(fileContent, { columns: true }, (err, records) => {
        if (err) {
          return reject(err);
        }
        resolve(records);
      });
    });
  });
}

// Helper function to stringify and write CSV asynchronously
function writeCsv(filePath, records) {
  return new Promise((resolve, reject) => {
    stringify(records, { header: true }, (err, output) => {
      if (err) {
        return reject(err);
      }
      fs.writeFile(filePath, output, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

function formatDate(dt_iso) {
  const date = new Date(dt_iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

// Function to determine the range based on rounds played
function determineRange(rounds) {
  const ranges = [
    [0, 19],
    [20, 39],
    [40, 59],
    [60, 79],
    [80, 99],
    [100, 119],
    [120, 139],
    [140, 159],
    [160, 179],
    [180, 200],
  ];
  for (let range of ranges) {
    if (rounds >= range[0] && rounds <= range[1]) {
      return `${range[0]}-${range[1]}`;
    }
  }
  return "Out of Range"; // For rounds outside the specified ranges
}

async function mergeDataAndWriteCsv() {
  try {
    const roundsPlayedData = await readCsv(roundsPlayedPath);
    const weatherData = await readCsv(weatherDataPath);

    const filteredWeatherData = weatherData.filter((row) => {
      const year = new Date(row.dt_iso.split(" ")[0]).getFullYear();
      return year > 2021;
    });

    const weatherDataFormatted = filteredWeatherData.map((row) => {
      return {
        Date: formatDate(row.dt_iso),
        temp: row.temp,
        temp_min: row.temp_min,
        temp_max: row.temp_max,
        humidity: row.humidity,
        wind_speed: row.wind_speed,
        wind_gust: row.wind_gust,
        rain_1h: row.rain_1h,
      };
    });

    const mergedData = roundsPlayedData.map((roundsRow) => {
      console.log("Raw RoundsPlayed value:", roundsRow["Rounds Played"]);

      const roundsPlayed = parseInt(roundsRow["Rounds Played"], 10);

      if (isNaN(roundsPlayed)) {
        console.error(
          "Failed to parse Rounds Played:",
          roundsRow["Rounds Played"]
        );
        return { ...roundsRow, RoundsRange: "Parse Error" };
      }

      const range = determineRange(roundsPlayed);
      const weatherRow = weatherDataFormatted.find(
        (weatherRow) => weatherRow.Date === roundsRow.Date
      );

      return {
        Date: roundsRow.Date,
        Day: roundsRow.Day,
        "Rounds Played": roundsPlayed,
        ...(weatherRow || {}),
        RoundsRange: range,
      };
    });

    await writeCsv(outputPath, mergedData);
    console.log(
      "Data merged and written to Training Data.csv with Rounds Range"
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

mergeDataAndWriteCsv();
