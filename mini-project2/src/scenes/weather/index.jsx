import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  useTheme,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { tokens } from "../../theme";
import useLocation from "../../hooks/useLocation";
import Header from "../../components/Header";

// WeatherWidget component definition
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isMetric, setIsMetric] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleUnits = () => setIsMetric(!isMetric);
  const { latitude, longitude, error } = useLocation();

  // Accessing the theme for styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // useEffect to fetch weather
  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/weather-by-location?lat=${latitude}&lon=${longitude}&units=${
            isMetric ? "metric" : "imperial"
          }`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude, isMetric]); // Depend on the units system

  // Render the component
  if (!weatherData) {
    return <Box m="20px">Loading...</Box>;
  }

  // Render method of the Weather component
  // Rendering the weather widget
  return (
    <Box sx={{ m: "20px" }}>
      <Header title="Weather" subtitle="Your Weather Dashboard" />
      <Box
        sx={{
          p: 2,
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          width: "100%",
          margin: "20px",
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
        {weatherData && weatherData.current && (
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
        {weatherData && weatherData.hourly && (
          <Box sx={{ overflowX: "auto", mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Hourly Forecast
            </Typography>
            <Box sx={{ display: "flex", width: "100%" }}>
              {/* Mapping over hourly data to display each hour's forecast */}
              {weatherData.hourly.slice(1, 13).map((hour, index) => (
                <Box
                  key={index} // Unique key for each hour
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
        )}

        {/* 7-Day Forecast Section */}
        {weatherData && weatherData.daily && (
          <Box>
            <Typography variant="h4" gutterBottom>
              7-Day Forecast
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "center",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: colors.grey[500],
                  borderRadius: "4px",
                },
              }}
            >
              {/* Mapping over dailyData to display each day's forecast */}
              {weatherData.daily.map((day, index) => (
                <Box
                  key={index} // Unique key for each item
                  sx={{
                    // Styling for each forecast item
                    minWidth: 150,
                    flexShrink: 0,
                    p: 2,
                    textAlign: "center",
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? colors.primary[900]
                        : colors.primary[500],
                    m: "0 8px",
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  {/* Displaying date */}
                  <Typography variant="subtitle1">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </Typography>

                  {/* Displaying high temperature */}
                  <Typography variant="subtitle2">
                    High: {day.temp.max}°{isMetric ? "C" : "F"}
                  </Typography>

                  {/* Displaying low temperature */}
                  <Typography variant="subtitle2">
                    Low: {day.temp.min}°{isMetric ? "C" : "F"}
                  </Typography>

                  {/* Displaying humidity */}
                  <Typography variant="subtitle2">
                    Humidity: {day.humidity}%
                  </Typography>

                  {/* Displaying wind speed */}
                  <Typography variant="subtitle2">
                    Wind: {day.wind_speed} {isMetric ? "m/s" : "mph"}
                  </Typography>

                  {/* Weather icon */}
                  <Box
                    component="img"
                    sx={{ height: 30 }}
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Weather;
