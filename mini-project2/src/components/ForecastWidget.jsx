import React, { useEffect, useState } from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

// Function to format a date as YYYY-MM-DD
const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    return [year, month, day].join("-");
  };
  
  // Function to calculate dates for a range of -7 to +7 days from today
  const calculateDates = () => {
    const dates = [];
    const today = new Date();
    // Adjust the range to go from -7 to +7 days
    for (let i = -7; i <= 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push({
        dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
        date: date.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
        }),
        dateString: formatDate(date),
        isToday: date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0),
      });
    }
    return dates;
  };

// Main component for the forecast
const ForecastWidget = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dates, setDates] = useState(calculateDates());
  const todayIndex = dates.findIndex((date) => date.isToday);



  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all(
        dates.map(async (date, index) => {
          // Fetch predictions for all days
          try {
            const predictionResponse = await fetch(
              `http://localhost:8082/api/prediction`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: date.dateString }),
              }
            );
            if (!predictionResponse.ok)
              throw new Error("Failed to fetch prediction");
            const predictionData = await predictionResponse.json();
            date.predictionRounds = predictionData.averageRoundsPlayed;
          } catch (error) {
            console.error(
              "Error fetching prediction for date " + date.dateString + ":",
              error
            );
          }
        })
      );
      // Update the state after all fetches are completed
      setDates([...dates]);
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      {/* Today's Card */}
      <Card
        sx={{
          background: colors.primary[400],
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            background: colors.blueAccent[700],
            textAlign: "center",
            color: "#fff",
            padding: "8px 0",
            mb: "20px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Today's Prediction:
          </Typography>
        </Box>
        <Box
          sx={{
            background: colors.primary[500],
            border: `3px solid ${colors.greenAccent[700]}`,
            borderRadius: "12px",
            padding: "20px",
            margin: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              fontSize: "6rem",
            }}
          >
            {dates[todayIndex].predictionRounds
              ? `${dates[todayIndex].predictionRounds}`
              : "Loading..."}
          </Typography>
          <Typography variant="h4">Rounds Played</Typography>
        </Box>
      </Card>
    </Box>
  );
};
export default ForecastWidget;
