import React from "react";
import { useState } from "react";
import { Box, Typography, Card, useTheme, Grid, FormControlLabel, Switch } from "@mui/material";
import { tokens } from "../theme";
import useWeatherApi from "../hooks/useWeatherApi";
import useLocation from "../hooks/useLocation";

const WeatherWidget = () => {
  const [isMetric, setIsMetric] = useState(false);
    const units = isMetric ? "metric" : "imperial";
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const toggleUnits = () => setIsMetric(!isMetric);
  
    const { latitude, longitude, error } = useLocation();
    const weatherData = useWeatherApi(latitude, longitude, units);
  
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  
    if (!weatherData) {
      return <Box>Loading...</Box>;
    }
  
    return (
      <Box
        sx={{
          p: 2,
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        {/* Date and Weather Overview */}
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
        <Typography variant="h3" sx={{ textAlign: "center", mb: 1 }}>
          {formattedDate}
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Weather Overview
        </Typography>
  
        {/* Current Weather */}
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
              <Grid item xs={4} sx={{ textAlign: "center" }}>
                <Typography variant="h6">
                  Now: {weatherData.current.temp}°{isMetric ? "C" : "F"}
                </Typography>
                <Typography variant="subtitle1">
                  Feels Like: {weatherData.current.feels_like}°{isMetric ? "C" : "F"}
                </Typography>
                <Typography variant="subtitle1">
                  Humidity: {weatherData.current.humidity}%
                </Typography>
                <Typography variant="subtitle1">
                  Wind: {weatherData.current.wind_speed} {isMetric ? "m/s" : "mph"}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Box
                  component="img"
                  sx={{ height: 50 }}
                  src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`}
                  alt={weatherData.current.weather[0].description}
                />
                <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                  {weatherData.current.weather[0].main} - {weatherData.current.weather[0].description}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="subtitle1">
                  Sunrise: {new Date(weatherData.current.sunrise * 1000).toLocaleTimeString()}
                </Typography>
                <Typography variant="subtitle1">
                  Sunset: {new Date(weatherData.current.sunset * 1000).toLocaleTimeString()}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        )}
  

      {/* Hourly Forecast */}
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          {weatherData.hourly.slice(0, 24).map((hour, index) => (
            <Box
              key={index}
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
              <Typography variant="subtitle2">
                {new Date(hour.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography variant="subtitle2">
                {hour.temp}°{isMetric ? "C" : "F"}
              </Typography>
              <Box
                component="img"
                sx={{ height: 25 }}
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt={hour.weather[0].description}
              />
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