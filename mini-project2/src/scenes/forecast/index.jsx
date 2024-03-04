import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Header from "../../components/Header";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const calculateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = -3; i <= 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push({
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      }),
      dateString: formatDate(date), // Ensure the correct format
      isToday: date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0),
    });
  }
  return dates;
};

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

  useEffect(() => {
    // Create a copy of dates to avoid directly mutating state
    let updatedDates = [...dates];

    dates.forEach((date, index) => {
      if (index < todayIndex && index >= todayIndex - 3) {
        const formattedDate = date.dateString;
        if (formattedDate !== "Invalid date") {
          fetch(`http://localhost:8082/api/dailyRounds/date/${formattedDate}`)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.rounds_played !== undefined) {
                updatedDates[index] = {
                  ...updatedDates[index],
                  actualRoundsPlayed: data.rounds_played,
                };
                // Update state only once after all fetches are done
                if (index === todayIndex - 1) {
                  setDates(updatedDates);
                }
              }
            })
            .catch((error) =>
              console.error("Error fetching actual rounds played data:", error)
            );
        }
      }
    });
  }, [todayIndex, dates]); // Added dates to the dependency array

  return (
    <Box m="20px">
      <Header
        title="ForeCast"
        subtitle="Data-Driven Trends for Informed Decisions"
      />
      <Box sx={{ overflowX: "auto", display: "flex", alignItems: "center" }}>
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
                {index < todayIndex && index >= todayIndex - 3 && (
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
                        }}
                      >
                        <Typography variant="h3" sx={{ textAlign: "center" }}>
                          95
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
                          border: `2px solid ${colors.greenAccent[700]}`,
                          borderRadius: "8px",
                          padding: "10px",
                        }}
                      >
                        <Typography variant="h3" sx={{ textAlign: "center" }}>
                          #%
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
                {/* For today and the next 3 days (existing logic) */}
                {index >= todayIndex && index <= todayIndex + 3 && (
                  <>
                    <Typography
                      variant={index === todayIndex ? "h2" : "h4"}
                      sx={{ margin: "20px 0 10px", fontWeight: "bold" }}
                    >
                      Prediction:
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
                        {index === todayIndex ? "56" : "TBD"}
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
