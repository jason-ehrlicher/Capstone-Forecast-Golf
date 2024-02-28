require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const WeatherController = require("./controllers/WeatherController");
const RoundsPlayedController = require("./controllers/RoundsPlayedController");
const WeatherByLocationController = require("./controllers/WeatherByLocationController");

const dailyRoundsRoutes = require("./routes/dailyRoundsRoutes");

const userRoutes = require("./routes/userRoutes");

const eventRoutes = require("./routes/eventRoutes");

const weatherDataRoutes = require("./routes/weatherDataRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// API Endpoints
app.get("/weather", WeatherController.getWeatherData);
app.get("/rounds-played", RoundsPlayedController.getRoundsPlayedData);
app.get(
  "/weather-by-location",
  WeatherByLocationController.getWeatherByLocation
);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dailyRounds", dailyRoundsRoutes);
app.use("/api/weatherData", weatherDataRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
