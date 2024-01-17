import React from "react";
import { Box, Typography, Card, useTheme } from "@mui/material";
import { tokens } from "../theme";

const HourlyForecast = ({ hourlyData, isMetric }) => {
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
        overflowX: "auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Hourly Forecast
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {hourlyData.map((hour, index) => (
          <Box
            key={index}
            sx={{
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
            <Typography variant="subtitle2">
              {hour.temp}°{isMetric ? "C" : "F"}
            </Typography>
            <Typography variant="subtitle2">
              {hour.weather[0].main}
            </Typography>
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
