import React from "react";
import { Box, Typography, Card, useTheme } from "@mui/material";
import { tokens } from "../theme";

// SevenDayForecast component definition
const SevenDayForecast = ({ dailyData, isMetric }) => {
  // Accessing the theme for styling
  const theme = useTheme();

  // Extracting color tokens based on the current theme mode
  const colors = tokens(theme.palette.mode);

  // Rendering the 7-day forecast card
  return (
    <Card
      // Styling for the card
      sx={{
        p: 3,
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[800]
            : colors.primary[400],
        color: colors.grey[100],
        overflowX: "auto", // Allows horizontal scrolling
        textAlign: "center",
      }}
    >
      {/* Title for the 7-day forecast */}
      <Typography variant="h3" gutterBottom>
        7-Day Forecast
      </Typography>

      {/* Container for daily forecast items */}
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {/* Mapping over dailyData to display each day's forecast */}
        {dailyData.map((day, index) => (
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
    </Card>
  );
};

export default SevenDayForecast;
