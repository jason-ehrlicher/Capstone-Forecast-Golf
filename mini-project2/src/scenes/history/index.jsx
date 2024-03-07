import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Tooltip from "@mui/material/Tooltip";

const History = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State variables
  const [selectedYear, setSelectedYear] = useState("");
  const [golfRoundsData, setGolfRoundsData] = useState([]);
  const [years, setYears] = useState([]);

  // Fetch data from APIs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch golf rounds data
        const golfDataResponse = await fetch(
          "http://localhost:8082/api/dailyRounds"
        );
        // Fetch weather data
        const weatherDataResponse = await fetch(
          "http://localhost:8082/api/weatherData"
        );

        if (!golfDataResponse.ok || !weatherDataResponse.ok) {
          throw new Error("Data fetch failed");
        }

        const golfData = await golfDataResponse.json();
        console.log("Golf Data:", golfData);
        const weatherData = await weatherDataResponse.json();
        console.log("Weather Data:", weatherData);
        // console.log(
        //   golfRoundsData.find((golfRound) => golfRound.date === "2022-01-01")
        // );
        // console.log(
        //   weatherData.find((weather) => weather.date === "2022-01-01")
        // );

        // Merge golf rounds and weather data
        let mergedData = mergeData(weatherData, golfData);

        // Set state variables
        setGolfRoundsData(mergedData);
        const extractedYears = Array.from(
          new Set(mergedData.map((item) => new Date(item.date).getFullYear()))
        ).sort();
        setYears(extractedYears);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Merge golf rounds and weather data
  const mergeData = (weatherData, golfRoundsData) => {
    const mergedData = golfRoundsData
      .filter((golfRound) => new Date(golfRound.date).getFullYear() !== 2021)
      .map((golfRound) => {
        const weather = weatherData.find((w) => w.date === golfRound.date);

        const dayOfWeek = new Date(golfRound.date).toLocaleDateString("en-US", {
          weekday: "long",
        });

        return {
          ...golfRound,
          dayOfWeek,
          roundsPlayed: golfRound.rounds_played,
          weatherDate: weather?.date,
          weatherIcon: weather?.weather_icon,
          temp: weather?.temp_mean,
          feelsLike: weather?.feels_like_mean,
          tempMin: weather?.temp_min,
          tempMax: weather?.temp_max,
          humidity: weather?.humidity_mean,
          windSpeed: weather?.wind_speed_mean,
          windGust: weather?.wind_speed_max,
          weatherMain: weather?.weather_main,
          weatherDescription: weather?.weather_description,
          rain: weather?.rain_sum,
        };
      });
    console.log("merged:", mergedData);
    return mergedData;
  };

  // Columns configuration for the data grid
  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "dayOfWeek", headerName: "Day", flex: 1 },
    {
      field: "roundsPlayed",
      headerName: "Rounds Played",
      type: "number",
      flex: 1,
    },
    {
      field: "weatherIcon",
      headerName: "Weather",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          // Construct URL for weather icon
          const iconUrl = `http://openweathermap.org/img/wn/${params.value}@2x.png`;
          // Tooltip content for weather details
          const tooltipContent = (
            <div>
              <p>
                <strong>Date:</strong> {params.row.date}
              </p>
              <p>
                <strong>Description:</strong> {params.row.weatherDescription}
              </p>
              <p>
                <strong>Temp:</strong> {Math.round(params.row.temp)}°F
              </p>
              <p>
                <strong>Feels Like:</strong> {Math.round(params.row.feelsLike)}
                °F
              </p>
              <p>
                <strong>Temp Min:</strong> {Math.round(params.row.tempMin)}°F
              </p>
              <p>
                <strong>Temp Max:</strong> {Math.round(params.row.tempMax)}°F
              </p>
              <p>
                <strong>Humidity:</strong> {Math.round(params.row.humidity)}%
              </p>
              <p>
                <strong>Wind Speed:</strong> {Math.round(params.row.windSpeed)}{" "}
                mph
              </p>
              <p>
                <strong>Wind Gust:</strong> {Math.round(params.row.windGust)}{" "}
                mph
              </p>
              <p>
                <strong>Rain:</strong>{" "}
                {params.row.rain !== undefined
                  ? `${params.row.rain} mm`
                  : "N/A"}
              </p>
            </div>
          );
          // Render weather icon with tooltip
          return (
            <Tooltip title={tooltipContent} arrow>
              <img
                src={iconUrl}
                alt="Weather Icon"
                style={{ width: "30px", height: "30px", marginLeft: "10px" }}
              />
            </Tooltip>
          );
        }
        return "";
      },
    },
  ];
  // Event handler for year selection change
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  // Group data by month
  const groupDataByMonth = (data) => {
    const monthlyData = {};
    data.forEach((item, index) => {
      const parsedDate = new Date(item.date);
      // Convert to UTC dates to avoid timezone issues
      const monthYear =
        parsedDate.getUTCFullYear() +
        "-" +
        ("0" + (parsedDate.getUTCMonth() + 1)).slice(-2); // YYYY-MM format for simplicity

      // Convert month index to month name if needed
      const monthName = parsedDate.toLocaleString("default", {
        month: "long",
        timeZone: "UTC",
      });
      const formattedMonthYear = `${monthName} ${parsedDate.getUTCFullYear()}`;

      if (!monthlyData[formattedMonthYear]) {
        monthlyData[formattedMonthYear] = [];
      }
      monthlyData[formattedMonthYear].push({
        ...item,
        uniqueId: `${formattedMonthYear}-${index}`,
      });
    });
    return monthlyData;
  };

  const renderMonthDataGrid = (monthYear, monthData, totalRoundsPlayed) => {
    const dataWithTotal = [
      ...monthData,
      {
        uniqueId: `${monthYear}-total`,
        date: "Total",
        dayOfWeek: "",
        roundsPlayed: totalRoundsPlayed,
      },
    ];
    // Render data grid for each month
    return (
      <Grid key={monthYear} item xs={12} sm={6} md={4}>
        <Typography variant="h6" gutterBottom>
          {monthYear}
        </Typography>
        <DataGrid
          rows={dataWithTotal}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          getRowId={(row) => row.uniqueId}
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
      </Grid>
    );
  };
  // Calculate total rounds played for the selected year
  const calculateYTDTotals = () => {
    return golfRoundsData.reduce((total, item) => {
      if (new Date(item.date).getFullYear().toString() === selectedYear) {
        return total + item.roundsPlayed;
      }
      return total;
    }, 0);
  };
  // Calculate quarterly totals for rounds played
  const calculateQuarterlyTotals = () => {
    const quarterlyTotals = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    golfRoundsData.forEach((item) => {
      if (new Date(item.date).getFullYear().toString() === selectedYear) {
        const month = new Date(item.date).getMonth() + 1;
        if (month >= 1 && month <= 3) quarterlyTotals.Q1 += item.roundsPlayed;
        else if (month >= 4 && month <= 6)
          quarterlyTotals.Q2 += item.roundsPlayed;
        else if (month >= 7 && month <= 9)
          quarterlyTotals.Q3 += item.roundsPlayed;
        else if (month >= 10 && month <= 12)
          quarterlyTotals.Q4 += item.roundsPlayed;
      }
    });
    return quarterlyTotals;
  };

  const YTDTotal = calculateYTDTotals();
  const quarterlyTotals = calculateQuarterlyTotals();
  // Group data by month
  const monthlyData = groupDataByMonth(
    selectedYear
      ? golfRoundsData.filter(
          (item) =>
            new Date(item.date).getUTCFullYear().toString() === selectedYear
        )
      : golfRoundsData
  );

  return (
    <Box m={2}>
      <Header title="HISTORICAL DATA" subtitle="Daily Rounds Played Archive" />
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            label="Select Year"
            onChange={handleYearChange}
          >
            <MenuItem value="">All Years</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {selectedYear && (
        <>
          {/* Display total rounds played for the selected year */}
          <Box
            mb={4}
            p={2}
            bgcolor={colors.blueAccent[700]}
            color="white"
            sx={{
              border: `1px solid ${colors.grey[300]}`,
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Typography
              variant="h2"
              textAlign="center"
              sx={{ fontSize: "1.5rem" }}
            >
              Total Rounds Played in {selectedYear}: {YTDTotal}
            </Typography>
          </Box>
          {/* Display quarterly totals for rounds played */}
          <Box
            mb={4}
            p={2}
            bgcolor={colors.blueAccent[700]}
            color="white"
            width="100%"
            sx={{
              border: `1px solid ${colors.grey[300]}`,
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Grid container justifyContent="center" alignItems="center">
              {Object.entries(quarterlyTotals).map(([quarter, total]) => (
                <Grid item xs={12} sm={3} key={quarter}>
                  <Typography
                    textAlign="center"
                    sx={{ fontSize: "1.5rem", color: "white" }}
                  >
                    {quarter}: {total} rounds
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
      {/* Display data grids for each month */}
      <Grid container spacing={2}>
        {Object.entries(monthlyData).map(([monthYear, monthData]) => {
          const totalRoundsPlayed = monthData.reduce(
            (sum, item) => sum + item.roundsPlayed,
            0
          );
          return renderMonthDataGrid(monthYear, monthData, totalRoundsPlayed);
        })}
      </Grid>
    </Box>
  );
};

export default History;
