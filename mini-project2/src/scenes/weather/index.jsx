import React, { useState, useEffect } from "react";
import { Box, Grid, useTheme, FormControlLabel, Switch } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useLocation from "../../hooks/useLocation";
import CurrentWeather from "../../components/CurrentWether";
import HourlyForecast from "../../components/HourlyForecast";
import SevenDayForecast from "../../components/SevenDayForecast";

const Weather = () => {
  const [isMetric, setIsMetric] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const { latitude, longitude, error } = useLocation();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Effect for fetching weather data when location changes
  useEffect(() => {
    if (latitude && longitude) {
      const fetchWeatherData = async () => {
        try {
          // Determine unit type based on state
          const units = isMetric ? "metric" : "imperial";
          // Fetch weather data from API based on location and units
          const response = await fetch(
            `http://localhost:8082/weather-by-location?lat=${latitude}&lon=${longitude}&units=${units}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setWeatherData(data);
        } catch (err) {
          console.error("Error fetching weather data:", err);
        }
      };

      fetchWeatherData();
    }
  }, [latitude, longitude, isMetric]);
  // Function to toggle unit type between metric and imperial
  const toggleUnits = () => setIsMetric(!isMetric);

  if (!weatherData) {
    return <Box m="20px">Loading...</Box>;
  }

  // Render method of the Weather component
  return (
    <Box sx={{ m: "20px" }}>
      <Header title="Weather" subtitle="Your Weather Dashboard" />

      <Box sx={{ textAlign: "center", mb: 3 }}></Box>

      {/* Toggle switch for changing units */}
      <FormControlLabel
        control={
          <Switch
            checked={isMetric}
            onChange={toggleUnits}
            // Styling for the switch
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
        sx={{
          mb: 2,
          color: colors.greenAccent[500],
        }}
      />
      {/* Grid layout for weather components */}
      <Grid container spacing={3}>
        {/* Display current weather */}
        <Grid item xs={12}>
          <CurrentWeather
            weatherData={weatherData.current}
            isMetric={isMetric}
          />
        </Grid>
        {/* Display hourly forecast */}
        <Grid item xs={12}>
          <HourlyForecast hourlyData={weatherData.hourly} isMetric={isMetric} />
        </Grid>
        {/* Display seven-day forecast */}
        <Grid item xs={12}>
          <SevenDayForecast dailyData={weatherData.daily} isMetric={isMetric} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Weather;
