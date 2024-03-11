import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Header from "../../components/Header";
import { Box, Card, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";
import ForecastWeatherWidget from "../../components/ForecastWeatherWidget";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { ResponsiveLine } from "@nivo/line";

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
    minHeight: "375px", // Adjust this value as needed to ensure uniform card sizes
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

  // Export Button Styling
  const StyledGridToolbarExport = styled(GridToolbarExport)(({ theme }) => ({
    color: theme.palette.common.white,
    backgroundColor: colors.primary[500],
    "&:hover": {
      backgroundColor: colors.blueAccent[700],
    },
  }));

  // Function to utilize MUI export
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <StyledGridToolbarExport />
      </GridToolbarContainer>
    );
  }

  // Prepare data for the line chart
  const chartData = [
    {
      id: "Predicted",
      data: dates.slice(todayIndex - 7, todayIndex + 1).map((date) => ({
        x: date.date,
        y: date.predictionRounds || 0,
      })),
    },
    {
      id: "Actual",
      data: dates.slice(todayIndex - 7, todayIndex + 1).map((date) => ({
        x: date.date,
        y: date.actualRoundsPlayed || 0,
      })),
    },
  ];
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

      {/* Next 7 Days Horizontal Scroll */}
      <Typography
        variant="h5"
        sx={{ marginBottom: "10px", fontWeight: "bold", textAlign: "center" }}
      >
        Next 7 Days:
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: colors.primary[400],
          },
          "&::-webkit-scrollbar-thumb": {
            background: colors.blueAccent[700],
            borderRadius: "4px",
          },
        }}
      >
        {dates.slice(todayIndex + 1, todayIndex + 8).map((date, index) => (
          <Card
            key={index}
            sx={{ ...cardStyle, minWidth: "300px", margin: "0 10px" }}
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
      </Box>

      {/* Last 7 Days Recap */}
      <Typography
        variant="h5"
        sx={{
          marginBottom: "10px",
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Last 7 Days:
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={dates
            .slice(todayIndex - 7, todayIndex)
            .reverse()
            .map((date, index) => ({
              id: index,
              date: `${date.dayOfWeek}, ${date.date}`,
              predicted: date.predictionRounds ? date.predictionRounds : "N/A",
              actual:
                date.actualRoundsPlayed !== undefined
                  ? date.actualRoundsPlayed
                  : "N/A",
              difference:
                date.actualRoundsPlayed !== undefined &&
                date.predictionRounds !== undefined
                  ? date.actualRoundsPlayed - date.predictionRounds
                  : "N/A",
              accuracy: calculateAccuracy(
                date.actualRoundsPlayed,
                date.predictionRounds
              )
                ? `${calculateAccuracy(
                    date.actualRoundsPlayed,
                    date.predictionRounds
                  )}%`
                : "N/A",
            }))}
          columns={[
            { field: "date", headerName: "Date", flex: 1 },
            { field: "predicted", headerName: "Predicted", flex: 1 },
            { field: "actual", headerName: "Actual", flex: 1 },
            { field: "difference", headerName: "Difference", flex: 1 },
            {
              field: "accuracy",
              headerName: "Accuracy",
              flex: 1,
              cellClassName: (params) =>
                params.value >= 80 ? "green-cell" : "red-cell",
            },
          ]}
          pageSize={7}
          rowsPerPageOptions={[7]}
          disableSelectionOnClick
          components={{
            Toolbar: CustomToolbar,
          }}
          sx={{
            "& .MuiDataGrid-root": {
              border: `1px solid ${colors.grey[300]}`,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.grey[300]}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: `1px solid ${colors.grey[300]}`,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${colors.grey[300]}`,
              backgroundColor: colors.blueAccent[700],
            },
            border: `1px solid ${colors.grey[300]}`,
            marginBottom: theme.spacing(2),
          }}
        />
      </div>
      {/* Line Chart */}
      <Box style={{ backgroundColor: colors.primary[400] }}>
        <Typography
          variant="h5"
          sx={{
            marginBottom: "10px",
            marginTop: "20px",
            fontWeight: "bold",
            textAlign: "center",
            padding: "15px",
          }}
        >
          Predicted vs Actual Rounds Played (Last 7 Days)
        </Typography>
        <div style={{ height: 400 }}>
        <ResponsiveLine
  data={chartData}
  colors={[colors.greenAccent[500], colors.blueAccent[700]]}
  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
  xScale={{ type: "point" }}
  yScale={{
    type: "linear",
    min: "auto",
    max: "auto",
    stacked: false,
    reverse: false,
  }}
  yFormat=" >-.2f"
  axisTop={null}
  axisRight={null}
  axisBottom={{
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Date",
    legendOffset: 36,
    legendPosition: "middle",
    legendTextColor: colors.greenAccent[500],
  }}
  axisLeft={{
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Rounds Played",
    legendOffset: -50,
    legendPosition: "middle",
    legendTextColor: colors.greenAccent[500],
  }}
  lineWidth={3}
  pointSize={8}
  pointColor={{ theme: "background" }}
  pointBorderWidth={2}
  pointBorderColor={{ from: "serieColor" }}
  pointLabelYOffset={-12}
  useMesh={true}
  enableGridX={true}
  enableGridY={true}
  theme={{
    axis: {
      domain: {
        line: {
          stroke: colors.grey[100],
        },
      },
      legend: {
        text: {
          fill: colors.grey[100],
        },
      },
      ticks: {
        line: {
          stroke: colors.grey[100],
          strokeWidth: 1,
        },
        text: {
          fill: colors.grey[100],
        },
      },
    },
    legends: {
      text: {
        fill: colors.grey[100],
      },
    },
    grid: {
      line: {
        stroke: colors.grey[200],
        strokeWidth: 1,
      },
    },
    tooltip: {
      container: {
        background: colors.primary[900],
        color: colors.grey[100],
      },
    },
  }}
  legends={[
    {
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: "left-to-right",
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: "circle",
      symbolBorderColor: "rgba(0, 0, 0, .5)",
      textColor: colors.grey[100],
      effects: [
        {
          on: "hover",
          style: {
            itemBackground: "rgba(0, 0, 0, .03)",
            itemOpacity: 1,
          },
        },
      ],
    },
  ]}
/>
        </div>
      </Box>
    </Box>
  );
};
export default Forecast;
