const fs = require('fs');
const readline = require('readline');
const processFile = require('./WeatherDataModel')
const path = require('path');

// combines weather data with daily rounds played data



// Function to read and process the Rounds Played CSV
async function readRoundsPlayed(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const roundsPlayedData = {};
    for await (const line of rl) {
        if (line.startsWith("Date")) continue; // Skip header

        const [date, day, roundsPlayed] = line.split(",");
        roundsPlayedData[date] = { day, roundsPlayed: parseInt(roundsPlayed, 10) };
    }

    return roundsPlayedData;
}

// Function to merge weather data with rounds played
function mergeData(weatherData, roundsPlayedData) {
    let mergedData = {};
    for (const date in weatherData) {
        if (roundsPlayedData[date]) {
            mergedData[date] = { ...weatherData[date], ...roundsPlayedData[date] };
        } else {
            console.log(`No rounds played data found for date: ${date}`);

        }
    }
    return mergedData;
}


// Example of how to use these functions
async function main() {
    const weatherFilePath = path.join(__dirname, '../data/Historical Weather Data.csv');
    const roundsPlayedFilePath = path.join(__dirname, '../data/Rounds Played copy.csv');

    const weatherData = await processFile(weatherFilePath);

    if (!weatherData) {
        console.error("Failed to process weather data.");
        return; // Exit the function if weatherData is not available
    }

    const roundsPlayedData = await readRoundsPlayed(roundsPlayedFilePath);

    console.log("Sample weather data:", Object.entries(weatherData).slice(0, 5));
    console.log("Sample rounds played data:", Object.entries(roundsPlayedData).slice(0, 5));
    
    const combinedData = mergeData(weatherData, roundsPlayedData);

    console.log(combinedData);
}

main();

module.exports = {
    readRoundsPlayed,
    mergeData,
};