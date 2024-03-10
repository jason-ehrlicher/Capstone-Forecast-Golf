import React from "react";
import {
  Box,
  Typography,
  Card,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../theme";
import useLocation from "../hooks/useLocation";

const ForecastWeatherWidget = ({ date }) => {
  const [weatherData, setWeatherData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { latitude, longitude } = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    if (!latitude || !longitude) return;
  
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/weather-by-location?lat=${latitude}&lon=${longitude}&units=imperial`
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
  }, [latitude, longitude]);
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!weatherData) {
    return <Box m="20px">Loading...</Box>;
  }

  // Create a new date object and add one day to it
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + 1);

  // Format the adjusted date
  const formattedDate = adjustedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Find the forecast data for the matching adjusted date
  const forecastData = weatherData.daily.find((day) => {
    const forecastDate = new Date(day.dt * 1000);
    return forecastDate.toDateString() === adjustedDate.toDateString();
  });

  if (!forecastData) {
    return <Box m="20px">No data available for the selected date.</Box>;
  }

  return (
    <Card
    sx={{
      p: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.primary[400],
      color: colors.grey[100],
    }}
  >
  {/* Temperatures */}
  <Box sx={{ textAlign: "left" }} p={"15px"}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="subtitle2" component="span">
        High:&nbsp;
      </Typography>
      <Typography variant="subtitle2" component="span">
        {forecastData.temp.max}°F
      </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="subtitle2" component="span">
        Low:&nbsp;
      </Typography>
      <Typography variant="subtitle2" component="span">
        {forecastData.temp.min}°F
      </Typography>
    </Box>
  </Box>

    {/* Weather Main Description */}
    <Box p={"15px"}>
      <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
        {forecastData.weather[0].main}
      </Typography>
    </Box>

    {/* Weather Icon */}
    <Box p={"15px"}>
      <img
        src={`http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`}
        alt={forecastData.weather[0].description}
        style={{ width: 50, height: 50 }}
      />
    </Box>
  </Card>
  );
};

export default ForecastWeatherWidget;
