const fs = require('fs');
const { parse } = require('csv-parse');
const Models = require("../models");
const path = require('path');

const csvFilePath = path.join(__dirname, '../data/Formatted Historical Weather Data.csv');

const fileStream = fs.createReadStream(csvFilePath);

const parser = fileStream.pipe(parse({
  columns: true,
  skip_empty_lines: true
}));



parser.on('readable', async function() {
  let record;
  while ((record = parser.read()) !== null) {
    // Adjust 'rain_1h' and 'snow_1h' before inserting the record
    record.rain_1h = record.rain_1h === '' ? null : parseFloat(record.rain_1h || '0');
    record.snow_1h = record.snow_1h === '' ? null : parseFloat(record.snow_1h || '0');


    (async () => {
      try {

        await Models.WeatherData.create(record);
      } catch (err) {
        console.error('Error inserting record into database:', err);
      }
    })();
  }
});

parser.on('end', () => {
  console.log('CSV file successfully processed and data inserted into database.');
});

parser.on('error', (err) => {
  console.error('Error processing CSV file:', err);
});
