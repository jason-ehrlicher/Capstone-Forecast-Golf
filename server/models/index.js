"use strict";
const User = require("./user"); //require the model
const Event = require("./event"); //require the model
const GolfRounds = require("./dailyRounds");
const WeatherData = require('./weatherData')

async function init() {
  await User.sync(); // sync the model
  await Event.sync();
  await GolfRounds.sync();
}

init();

module.exports = {
  User,
  Event,
  GolfRounds,
  WeatherData
};
