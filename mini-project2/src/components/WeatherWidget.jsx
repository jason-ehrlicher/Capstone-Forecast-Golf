import React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  useTheme,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { tokens } from "../theme";
import useWeatherApi from "../hooks/useWeatherApi";
import useLocation from "../hooks/useLocation";

// WeatherWidget component definition
const WeatherWidget = () => {
  // Accessing the theme for styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for toggling between metric and imperial units
  const [isMetric, setIsMetric] = useState(false);
  const units = isMetric ? "metric" : "imperial";

  // Function to toggle the unit state
  const toggleUnits = () => setIsMetric(!isMetric);

  // Custom hooks to get location and weather data
  const { latitude, longitude, error } = useLocation();
  const weatherData = useWeatherApi(latitude, longitude, units);

  // Formatting today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Handling the loading state
  if (!weatherData) {
    return <Box m="20px">Loading...</Box>;
  }

  // Rendering the weather widget
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
      }}
    >
      {/* Switch for toggling temperature units */}
      <FormControlLabel
        control={
          <Switch
            checked={isMetric}
            onChange={toggleUnits}
            // Styling for the switch component
            sx={{
              "& .MuiSwitch-switchBase": {
                color: colors.greenAccent[500],
              },
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: colors.greenAccent[500],
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: colors.blueAccent[400],
              },
              "& .MuiSwitch-track": {
                backgroundColor: colors.grey[300],
              },
            }}
          />
        }
        label={isMetric ? "Celsius" : "Fahrenheit"}
        // Styling for the label of the switch
        sx={{
          mb: 2,
          color: colors.greenAccent[500],
        }}
      />

      {/* Displaying the current date */}
      <Typography variant="h3" sx={{ textAlign: "center", mb: 1 }}>
        {formattedDate}
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        Weather Overview
      </Typography>

      {/* Current Weather Card */}
      {weatherData.current && (
        <Card
          sx={{
            mb: 2,
            p: 2,
            backgroundColor:
              theme.palette.mode === "light"
                ? colors.primary[900]
                : colors.primary[400],
            color: colors.grey[100],
          }}
        >
          <Grid container spacing={2}>
            {/* Grid layout for current weather details */}
            {/* Each Grid item represents a different aspect of the current weather */}

            {/* Temperature and related details */}
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              {/* Displaying current temperature */}
              <Typography variant="h6">
                Now: {weatherData.current.temp}°{isMetric ? "C" : "F"}
              </Typography>

              {/* Displaying feels like temperature */}
              <Typography variant="subtitle1">
                Feels Like: {weatherData.current.feels_like}°
                {isMetric ? "C" : "F"}
              </Typography>

              {/* Displaying humidity */}
              <Typography variant="subtitle1">
                Humidity: {weatherData.current.humidity}%
              </Typography>

              {/* Displaying wind speed */}
              <Typography variant="subtitle1">
                Wind: {weatherData.current.wind_speed}{" "}
                {isMetric ? "m/s" : "mph"}
              </Typography>
            </Grid>

            {/* Weather condition and icon */}
            <Grid
              item
              xs={4}
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Displaying weather icon */}
              <Box
                component="img"
                sx={{ height: 50 }}
                src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`}
                alt={weatherData.current.weather[0].description}
              />

              {/* Displaying weather condition */}
              <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                {weatherData.current.weather[0].main} -{" "}
                {weatherData.current.weather[0].description}
              </Typography>
            </Grid>

            {/* Sunrise and sunset times */}
            <Grid
              item
              xs={4}
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Displaying sunrise time */}
              <Typography variant="subtitle1">
                Sunrise:{" "}
                {new Date(
                  weatherData.current.sunrise * 1000
                ).toLocaleTimeString()}
              </Typography>

              {/* Displaying sunset time */}
              <Typography variant="subtitle1">
                Sunset:{" "}
                {new Date(
                  weatherData.current.sunset * 1000
                ).toLocaleTimeString()}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Hourly Forecast Section */}
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          {/* Mapping over hourly data to display each hour's forecast */}
          {weatherData.hourly.slice(1, 13).map((hour, index) => (
            <Box
              key={index}  // Unique key for each hour
              sx={{
                minWidth: 150,
                p: 1,
                textAlign: "center",
                backgroundColor:
                  theme.palette.mode === "light"
                    ? colors.primary[900]
                    : colors.primary[500],
                borderRadius: 1,
                m: "0 4px",
                flex: "1 1 auto",
                mb: 2,
              }}
            >
              {/* Displaying the time of the forecast */}
              <Typography variant="subtitle2">
                {new Date(hour.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>

               {/* Displaying the temperature */}
              <Typography variant="subtitle2">
                {hour.temp}°{isMetric ? "C" : "F"}
              </Typography>

              {/* Displaying the weather icon */}
              <Box
                component="img"
                sx={{ height: 25 }}
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt={hour.weather[0].description}
              />

              {/* Displaying the main weather condition */}
              <Typography variant="subtitle2">
                {hour.weather[0].main}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WeatherWidget;