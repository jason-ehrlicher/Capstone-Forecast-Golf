"use strict";
const Models = require("../models");
const { sequelize } = require('../dbConnect');


// Retrieve all weather data from the database
const getWeatherData = (req, res) => {
  Models.WeatherData.findAll({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error retrieving weather data", error: error.message });
    });
};

// Retrieve weather data by date
// const getWeatherDataByDate = (req, res) => {
//     const { date } = req.params; // Assuming date is in 'YYYY-MM-DD' format

//     Models.WeatherData.findOne({
//       where: sequelize.where(sequelize.fn('date', sequelize.col('dt_iso')), '=', date)
//     })
//     .then(data => {
//       if (data) {
//         res.status(200).json(data);
//       } else {
//         res.status(404).send({ message: `No weather data found for date ${date}.` });
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(500).send({ message: "Error retrieving weather data for the specified date", error: error.message });
//     });
// };

// Create a new weather data record in the database
const createWeatherData = (req, res) => {
  const weatherData = req.body; // Assuming weatherData contains all the required fields
  Models.WeatherData.create(weatherData)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error creating weather data", error: error.message });
    });
};

// Update an existing weather data record in the database
const updateWeatherData = (req, res) => {
  const { id } = req.params; // ID is used to identify the record
  const updateData = req.body; // updateData contains the fields to be updated

  Models.WeatherData.update(updateData, { where: { id } })
    .then((numUpdated) => {
      if (numUpdated[0] === 1) {
        Models.WeatherData.findByPk(id)
          .then((updatedData) => {
            if (updatedData) {
              res.status(200).json(updatedData);
            } else {
              res.status(404).send({ message: "Weather data not found." });
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send({ message: "An error occurred while retrieving updated weather data.", error: error.message });
          });
      } else {
        res.status(404).send({ message: `Cannot update weather data with id=${id}. Maybe weather data was not found or req.body is empty!` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error updating weather data", error: error.message });
    });
};

// Delete a weather data record from the database
const deleteWeatherData = (req, res) => {
  const { id } = req.params; 

  Models.WeatherData.destroy({ where: { id } })
    .then((numDeleted) => {
      if (numDeleted === 1) {
        res.status(200).send({ message: "Weather data was deleted successfully." });
      } else {
        res.status(404).send({ message: `Cannot delete weather data with id=${id}. Maybe weather data was not found.` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error deleting weather data", error: error.message });
    });
};

module.exports = {
  getWeatherData,
  // getWeatherDataByDate,
  createWeatherData,
  updateWeatherData,
  deleteWeatherData,
};
