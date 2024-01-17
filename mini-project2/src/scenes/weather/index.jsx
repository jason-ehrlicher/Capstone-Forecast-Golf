import React, { useState } from "react";
import { Box, Grid, useTheme, FormControlLabel, Switch } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useWeatherApi from "../../hooks/useWeatherApi";
import useLocation from "../../hooks/useLocation";
import CurrentWeather from "../../components/CurrentWether";
import HourlyForecast from "../../components/HourlyForecast";
import SevenDayForecast from "../../components/SevenDayForecast";

const Weather = () => {
  const [isMetric, setIsMetric] = useState(false);
  const units = isMetric ? "metric" : "imperial";
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { latitude, longitude, error } = useLocation();
  const weatherData = useWeatherApi(latitude, longitude, units);

  const toggleUnits = () => setIsMetric(!isMetric);

  if (!weatherData) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ m: "20px" }}>
      <Header title="Weather Dashboard" subtitle="Current and Forecast Data" />

      <Box sx={{ textAlign: "center", mb: 3 }}></Box>
      <FormControlLabel
        control={
          <Switch
            checked={isMetric}
            onChange={toggleUnits}
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

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CurrentWeather
            weatherData={weatherData.current}
            isMetric={isMetric}
          />
        </Grid>
        <Grid item xs={12}>
          <HourlyForecast hourlyData={weatherData.hourly} isMetric={isMetric} />
        </Grid>
        <Grid item xs={12}>
          <SevenDayForecast dailyData={weatherData.daily} isMetric={isMetric} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Weather;
