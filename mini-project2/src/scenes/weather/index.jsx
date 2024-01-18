import React, { useState } from "react";
import {
  Box,
  Grid,
  useTheme,
  FormControlLabel,
  Switch,
  Card,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useWeatherApi from "../../hooks/useWeatherApi";
import useLocation from "../../hooks/useLocation";
import CurrentWeather from "../../components/CurrentWether";
import HourlyForecast from "../../components/HourlyForecast";
import SevenDayForecast from "../../components/SevenDayForecast";

// Weather component definition
const Weather = () => {
  // State for toggling between metric and imperial units
  const [isMetric, setIsMetric] = useState(false);

  // Determine the unit type based on state
  const units = isMetric ? "metric" : "imperial";

  const theme = useTheme();
  // Generating color tokens based on the current theme mode
  const colors = tokens(theme.palette.mode);

  // Custom hook to get the user's current location
  const { latitude, longitude, error } = useLocation();

  // Custom hook to fetch weather data using the API
  const weatherData = useWeatherApi(latitude, longitude, units);

  // Function to toggle between metric and imperial units
  const toggleUnits = () => setIsMetric(!isMetric);

  // Loading state: Displayed when weather data is not yet available
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
