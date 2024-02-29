const fetch = require("node-fetch");
const path = require("path");

// Function to fetch daily rounds played data from the API
async function fetchRoundsPlayed() {
  const url = "http://localhost:8082/api/dailyRounds"; 
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching rounds played data:", error);
    return null;
  }
}

// Function to fetch weather data from the API
async function fetchWeatherData() {
  const url = "http://localhost:8082/api/weatherData"; 
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

// Function to merge weather data with rounds played
function mergeData(weatherData, roundsPlayedData) {
  let mergedData = {};
  weatherData.forEach((weatherEntry) => {
    const date = weatherEntry.date;
    const roundsPlayedEntry = roundsPlayedData.find(
      (entry) => entry.date === date
    );
    if (roundsPlayedEntry) {
      mergedData[date] = {
        ...weatherEntry,
        roundsPlayed: roundsPlayedEntry.rounds_played,
      };
    } else {
      console.log(`No rounds played data found for date: ${date}`);
    }
  });
  return mergedData;
}

async function main() {
  const weatherData = await fetchWeatherData();
  if (!weatherData) {
    console.error("Failed to fetch weather data.");
    return;
  }

  const roundsPlayedData = await fetchRoundsPlayed();
  if (!roundsPlayedData) {
    console.error("Failed to fetch rounds played data.");
    return;
  }

  const combinedData = mergeData(weatherData, roundsPlayedData);
  console.log(combinedData);
}

main();
module.exports = { mergeData };