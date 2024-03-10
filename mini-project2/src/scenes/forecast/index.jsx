import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Header from "../../components/Header";
import { Box, Card, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";
import ForecastWeatherWidget from "../../components/ForecastWeatherWidget";

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
const Forecast = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Initialize the dates state with the calculated dates
  const [dates, setDates] = useState(calculateDates());
  const todayIndex = dates.findIndex((date) => date.isToday);

  const cardStyle = {
    background: colors.primary[400],
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Ensures content is spaced out evenly
    minHeight: "475px", // Adjust this value as needed to ensure uniform card sizes

  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all(
        dates.map(async (date, index) => {
          // Fetch actual rounds for previous days
          if (index < todayIndex) {
            try {
              const response = await fetch(
                `http://localhost:8082/api/dailyRounds/date/${date.dateString}`
              );
              if (!response.ok)
                throw new Error("Failed to fetch actual rounds played");
              const data = await response.json();
              date.actualRoundsPlayed = data.rounds_played;
            } catch (error) {
              console.error("Error fetching actual rounds played data:", error);
            }
          }

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

  // Function to calculate accuracy of predictions
  const calculateAccuracy = (actual, predicted) => {
    if (actual !== undefined && predicted !== undefined) {
      const difference = Math.abs(actual - predicted);
      const accuracy = 100 - (difference / actual) * 100;
      return Math.max(0, accuracy).toFixed(2); // Ensure accuracy is not negative
    }
    return undefined;
  };

  return (
    <Box m="20px">
      <Header
        title="ForeCast"
        subtitle="Data-Driven Trends for Informed Decisions"
      />
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
            background: colors.primary[400],
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
        <ForecastWeatherWidget date={new Date(dates[todayIndex].dateString)} />
      </Card>
      {/* Two Columns */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ marginBottom: "10px", fontWeight: "bold", textAlign: "center" }}
          >
            Last 7 Days:
          </Typography>
          {dates
            .slice(todayIndex - 7, todayIndex)
            .reverse()
            .map((date, index) => (
              <Card key={index} sx={cardStyle}>
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
                    variant="h6"
                    sx={{ marginBottom: "10px", textAlign: "center" }}
                  >
                    {`${date.dayOfWeek}, ${date.date}`}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "20px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      minWidth: "100px",
                      fontWeight: "bold",
                      textAlign: "left",
                      marginRight: "10px",
                    }}
                  >
                    Prediction:
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      background: colors.primary[400],
                      border: `2px solid ${colors.greenAccent[700]}`,
                      borderRadius: "8px",
                      padding: "10px",
                      width: "115px",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "2.5rem",
                        textAlign: "center",
                      }}
                    >
                      {date.predictionRounds
                        ? `${date.predictionRounds}`
                        : "Loading..."}
                    </Typography>
                    <Typography textAlign={"center"}>Rounds Played</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "20px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      minWidth: "100px",
                      fontWeight: "bold",
                      textAlign: "left",
                      marginRight: "10px",
                    }}
                  >
                    Actual:
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      background: colors.primary[400],
                      border: `2px solid ${colors.greenAccent[700]}`,
                      borderRadius: "8px",
                      padding: "10px",
                      width: "115px",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "2.5rem",
                        textAlign: "center",
                      }}
                    >
                      {date.actualRoundsPlayed !== undefined
                        ? `${date.actualRoundsPlayed}`
                        : "Loading..."}
                    </Typography>
                    <Typography textAlign={"center"}>Rounds Played</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    margin: "20px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      minWidth: "100px",
                      fontWeight: "bold",
                      textAlign: "left",
                      marginRight: "10px",
                    }}
                  >
                    Accuracy:
                  </Typography>
                  <Box
                    sx={{
                      // margin: "20px",
                      flexGrow: 1,
                      background: colors.primary[400],
                      border: `2px solid ${
                        calculateAccuracy(
                          date.actualRoundsPlayed,
                          date.predictionRounds
                        ) >= 80
                          ? colors.greenAccent[700]
                          : colors.redAccent[700]
                      }`,
                      backgroundColor:
                        calculateAccuracy(
                          date.actualRoundsPlayed,
                          date.predictionRounds
                        ) >= 80
                          ? "green"
                          : "red",
                      borderRadius: "8px",
                      padding: "10px",
                      width: "115px",
                    }}
                  >
                    <Typography variant="h3" sx={{ textAlign: "center" }}>
                      {calculateAccuracy(
                        date.actualRoundsPlayed,
                        date.predictionRounds
                      )
                        ? `${calculateAccuracy(
                            date.actualRoundsPlayed,
                            date.predictionRounds
                          )}%`
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
        </Grid>
        {/* Next 7 Days Column */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ marginBottom: "10px", fontWeight: "bold",  textAlign: "center" }}
          >
            Next 7 Days:
          </Typography>
          {dates.slice(todayIndex + 1, todayIndex + 8).map((date, index) => (
            <Card key={index} sx={cardStyle}>
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
                  variant="h6"
                  sx={{ marginBottom: "10px", textAlign: "center" }}
                >
                  {`${date.dayOfWeek}, ${date.date}`}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                textAlign={"center"}
                sx={{ margin: "20px 0 10px", fontWeight: "bold" }}
              >
                Prediction:
              </Typography>
              <Box
                sx={{
                  background: colors.primary[400],
                  border: `3px solid ${colors.greenAccent[700]}`,
                  borderRadius: "12px",
                  padding: "15px",
                  margin: "0 20px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2.5rem",
                  }}
                >
                  {date.predictionRounds
                    ? `${date.predictionRounds}`
                    : "Loading..."}
                </Typography>
                <Typography variant="h6">Rounds Played</Typography>
              </Box>
              <ForecastWeatherWidget date={new Date(date.dateString)} />
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Forecast;
