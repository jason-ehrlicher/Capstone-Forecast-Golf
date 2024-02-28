const fs = require('fs');
const csv = require('csv-parser'); 
const path = require('path');
const GolfRounds = require('../models/dailyRounds'); 

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });





const csvFilePath = path.join(__dirname, '../data/Rounds Played copy.csv');

// Function to read and insert data from CSV to MySQL
async function insertDataFromCSV(csvFilePath) {

    console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST);

  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        for (let row of results) {
            try {
              await GolfRounds.create({
                date: row.Date,
                day: row.Day,
                rounds_played: parseInt(row['Rounds Played']),
              });
            } catch (error) {
              console.error('Error inserting row:', row, error);
            }
          }
        
          console.log('Data import complete');
        });
}


insertDataFromCSV(csvFilePath);
