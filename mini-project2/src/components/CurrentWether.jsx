import React from "react";
import { Box, Typography, Card, useTheme } from "@mui/material";
import { tokens } from "../theme";

const CurrentWeather = ({ weatherData, isMetric }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        p: 3,
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[800]
            : colors.primary[400],
        color: colors.grey[100],
        textAlign: "center",
        mb: 5,
      }}
    >
      <Typography variant="h3" gutterBottom>
        Current Weather
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            minWidth: 150,
            flexShrink: 0,
            p: 2,
            textAlign: "center",
            backgroundColor:
              theme.palette.mode === "light"
                ? colors.primary[900]
                : colors.primary[500],
            borderRadius: 2,
            m: "0 8px",
          }}
        >
          <Typography variant="h6">
            Temperature: {weatherData.temp}°{isMetric ? "C" : "F"}
          </Typography>
          <Typography variant="subtitle1">
            Feels Like: {weatherData.feels_like}°{isMetric ? "C" : "F"}
          </Typography>
          <Typography variant="subtitle1">
            Humidity: {weatherData.humidity}%
          </Typography>
          <Typography variant="subtitle1">
            Wind: {weatherData.wind_speed} {isMetric ? "m/s" : "mph"}
          </Typography>
          <Typography variant="subtitle1">
            Sunrise: {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}
          </Typography>
          <Typography variant="subtitle1">
            Sunset: {new Date(weatherData.sunset * 1000).toLocaleTimeString()}
          </Typography>
          <Typography variant="subtitle1">
            Condition: {weatherData.weather[0].main}
          </Typography>
          <Box
            component="img"
            sx={{ height: 50 }}
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default CurrentWeather;
