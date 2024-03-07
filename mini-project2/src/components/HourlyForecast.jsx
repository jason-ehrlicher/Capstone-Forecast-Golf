import React from "react";
import { Box, Typography, Card, useTheme } from "@mui/material";
import { tokens } from "../theme";

// HourlyForecast component definition
const HourlyForecast = ({ hourlyData, isMetric }) => {
  // Accessing the theme for styling
  const theme = useTheme();

  // Extracting color tokens based on the current theme mode
  const colors = tokens(theme.palette.mode);

  // Limiting the hourlyData to the next 12 hours
  const next12HoursData = hourlyData.slice(1, 13);

  // Rendering the hourly forecast card
  return (
    <Card
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
      {/* Title for the hourly forecast */}
      <Typography variant="h3" gutterBottom>
        Hourly Forecast
      </Typography>

      {/* Container for hourly forecast items */}
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {/* Mapping over hourlyData to display each hour's forecast */}
        {next12HoursData.map((hour, index) => (
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
            {/* Displaying date and time */}
            <Typography variant="subtitle1">
              {new Date(hour.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </Typography>
            <Typography variant="subtitle2">
              {new Date(hour.dt * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>

            {/* Displaying temperature */}
            <Typography variant="subtitle2">
              {hour.temp}°{isMetric ? "C" : "F"}
            </Typography>

            {/* Displaying weather condition */}
            <Typography variant="subtitle2">{hour.weather[0].main}</Typography>

            {/* Weather icon */}
            <Box
              component="img"
              sx={{ height: 30 }}
              src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
              alt={hour.weather[0].description}
            />
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default HourlyForecast;
