import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Header from "../../components/Header";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

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
  const todayCardHeight = 350;
  const otherCardHeight = 300;

  // Ref for the scroll container
  const scrollContainerRef = useRef(null);
  // Ref for today's card
  const todayCardRef = useRef(null);

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

  // Centers scroll position on today
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;

      // Adjust these values based on the new range of cards
      const todayCardWidth = 300;
      const otherCardWidth = 260;
      const cardsToLeft = 7; // Now 7 cards to the left of today's card

      const totalWidthToLeft = cardsToLeft * otherCardWidth;

      // Adjust the calculation for the initial scroll position
      const leftOffset =
        totalWidthToLeft + todayCardWidth / 2 - scrollContainer.offsetWidth / 2;

      scrollContainer.scrollLeft = leftOffset;
    }
  }, []); // This effect runs only once after the initial render.

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
      <Box
        ref={scrollContainerRef}
        sx={{ overflowX: "auto", display: "flex", alignItems: "center" }}
      >
        <Box sx={{ display: "inline-flex", minWidth: "100%" }}>
          {dates.map((date, index) => (
            <Box
              key={index}
              ref={index === todayIndex ? todayCardRef : null}
              sx={{
                minWidth: date.isToday ? 300 : 260,
                marginRight: 2,
                marginBottom: 3,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                height: `${todayCardHeight}px`,
              }}
            >
              <Card
                sx={{
                  height: date.isToday
                    ? `${todayCardHeight}px`
                    : `${otherCardHeight}px`,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  background: colors.primary[400],
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    background: colors.blueAccent[700],
                    textAlign: "center",
                    color: "#fff",
                    padding: "8px 0",
                  }}
                >
                  <Typography variant="subtitle1">{`${date.dayOfWeek}, ${date.date}`}</Typography>
                </Box>
                {/* For the 3 previous days */}
                {index < todayIndex && index >= todayIndex - 7 && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 20px",
                        marginBottom: "10px",
                        marginTop: "5px",
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
                        <Typography variant="h3" sx={{ textAlign: "center" }}>
                          {date.predictionRounds
                            ? `${date.predictionRounds}`
                            : "Loading..."}
                        </Typography>
                        <Typography>Rounds Played</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 20px",
                        marginBottom: "10px",
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
                        {/* Conditionally render actualRoundsPlayed or a placeholder */}
                        <Typography variant="h3" sx={{ textAlign: "center" }}>
                          {date.actualRoundsPlayed !== undefined
                            ? `${date.actualRoundsPlayed}`
                            : "Loading..."}
                        </Typography>
                        <Typography>Rounds Played</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 20px",
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
                              : "red", // Conditional background color
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
                  </>
                )}
                {/* For today and the next 3 days (existing logic) */}
                {index >= todayIndex && index <= todayIndex + 7 && (
                  <>
                    <Typography
                      variant={index === todayIndex ? "h2" : "h4"}
                      sx={{ margin: "20px 0 10px", fontWeight: "bold" }}
                    >
                      {index === todayIndex
                        ? "Today's Prediction:"
                        : "Prediction:"}
                    </Typography>
                    <Box
                      sx={{
                        background: colors.primary[400],
                        border: `3px solid ${colors.greenAccent[700]}`,
                        borderRadius: "12px",
                        padding: index === todayIndex ? "20px" : "15px",
                        margin: "0 20px",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant={index === todayIndex ? "h1" : "h3"}
                        sx={{
                          fontWeight: "bold",
                          fontSize: index === todayIndex ? "6rem" : "2.5rem",
                        }}
                      >
                        {date.predictionRounds
                          ? `${date.predictionRounds}`
                          : "Loading..."}
                      </Typography>
                      <Typography variant={index === todayIndex ? "h4" : "h6"}>
                        Rounds Played
                      </Typography>
                    </Box>
                    {/* Weather Forecast placeholder */}
                    {/* <Typography
                      variant="h5"
                      sx={{ margin: "20px 0", textAlign: "center" }}
                    >
                      Weather Forecast:
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ margin: "0px 0", textAlign: "center" }}
                    >
                      Placeholder for API data
                    </Typography> */}
                  </>
                )}
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Forecast;
