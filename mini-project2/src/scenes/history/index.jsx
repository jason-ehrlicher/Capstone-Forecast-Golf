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

  const [selectedYear, setSelectedYear] = useState("");
  const [golfRoundsData, setGolfRoundsData] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const golfDataResponse = await fetch(
          "http://localhost:8082/api/dailyRounds"
        );
        const weatherDataResponse = await fetch(
          "http://localhost:8082/api/weatherData"
        );

        if (!golfDataResponse.ok || !weatherDataResponse.ok) {
          throw new Error("Data fetch failed");
        }

        const golfData = await golfDataResponse.json();
        console.log("Golf Data:", golfData);
        const weatherData = await weatherDataResponse.json();

        let mergedData = mergeData(weatherData, golfData);

        // Exclude records from 2021 before setting the state
        // console.log("Merged Data Before Filtering:", mergedData);
        mergedData = mergedData.filter(
          (item) => new Date(item.date + "T12:00:00Z").getUTCFullYear() !== 2021
        );

        // console.log("Merged Data After Filtering:", mergedData);

        setGolfRoundsData(mergedData);
        const extractedYears = Array.from(
          new Set(
            mergedData.map((item) =>
              new Date(item.date + "T12:00:00Z").getUTCFullYear()
            )
          )
        ).sort();
        setYears(extractedYears);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const mergeData = (weatherData, golfRoundsData) => {
    const mergedData = golfRoundsData.map((golfRound) => {
      let weather;

      // Generate an array of times to check based on the pattern
      const times = Array.from({ length: 24 }, (_, index) => {
        const hour = index < 12 ? 12 - index : index - 11;
        const suffix = index % 2 === 0 ? ":00:00" : ":00:00";
        return `${hour.toString().padStart(2, "0")}${suffix}`;
      });

      // Ensure unique and ordered times, starting with "12:00:00"
      const uniqueTimes = ["12:00:00", ...new Set(times)].filter(
        (time, index, self) => self.indexOf(time) === index
      );

      // Find the first matching weather data
      for (let time of uniqueTimes) {
        weather = weatherData.find(
          (w) => w.date === golfRound.date && w.time === time
        );
        if (weather) break; // Exit loop on first match
      }

      // Construct the merged data object with the found weather information, if any
      return {
        ...golfRound,
        roundsPlayed: golfRound.rounds_played,
        weatherDate: weather?.date,
        weatherIcon: weather?.weather_icon,
        temp: weather?.temp,
        feelsLike: weather?.feels_like,
        tempMin: weather?.temp_min,
        tempMax: weather?.temp_max,
        pressure: weather?.pressure,
        humidity: weather?.humidity,
        windSpeed: weather?.wind_speed,
        windGust: weather?.wind_gust,
        weatherMain: weather?.weather_main,
        weatherDescription: weather?.weather_description,
      };
    });

    return mergedData;
  };

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "day", headerName: "Day", flex: 1 },
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
          const iconUrl = `http://openweathermap.org/img/wn/${params.value}@2x.png`;
          const tooltipContent = (
            <div>
              <p>
                <strong>Date:</strong> {params.row.date}
              </p>
              {/* <p><strong>Main:</strong> {params.row.weatherMain}</p> */}
              <p>
                <strong>Description:</strong> {params.row.weatherDescription}
              </p>
              <p>
                <strong>Temp:</strong> {params.row.temp}°F
              </p>
              <p>
                <strong>Feels Like:</strong> {params.row.feelsLike}°F
              </p>
              <p>
                <strong>Temp Min:</strong> {params.row.tempMin}°F
              </p>
              <p>
                <strong>Temp Max:</strong> {params.row.tempMax}°F
              </p>
              <p>
                <strong>Pressure:</strong> {params.row.pressure} hPa
              </p>
              <p>
                <strong>Humidity:</strong> {params.row.humidity}%
              </p>
              <p>
                <strong>Wind Speed:</strong> {params.row.windSpeed} mph
              </p>
              <p>
                <strong>Wind Gust:</strong> {params.row.windGust} mph
              </p>
            </div>
          );

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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);

    // Refilter the data whenever the selected year changes
    filterAndSetData(event.target.value);
  };

  const filterAndSetData = (selectedYear) => {
    // Filter data based on the selected year, considering UTC dates to ensure accuracy
    const filteredData = golfRoundsData.filter((item) => {
      const itemYear = new Date(item.date + "T12:00:00Z")
        .getUTCFullYear()
        .toString();
      return selectedYear === "" || itemYear === selectedYear;
    });

    const groupedData = groupDataByMonth(filteredData);
  };

  const groupDataByMonth = (data) => {
    const monthlyData = {};
    data.forEach((item) => {
      // Ensure using UTC dates to avoid timezone affecting the day
      const parsedDate = new Date(item.date + "T12:00:00Z");
      const year = parsedDate.getUTCFullYear();
      const month = parsedDate.getUTCMonth() + 1; // Adjust month index (+1)
      const monthYearKey = `${year}-${String(month).padStart(2, "0")}`;

      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = [];
      }
      monthlyData[monthYearKey].push(item);
    });

    const sortedMonthlyData = Object.keys(monthlyData)
      .sort()
      .reduce((acc, key) => {
        const readableKey = `${new Date(key + "-01T00:00:00Z").toLocaleString(
          "default",
          { month: "long", year: "numeric", timeZone: "UTC" }
        )}`;
        acc[readableKey] = monthlyData[key];
        return acc;
      }, {});

    // Convert monthYearKey to "January 2023" format for labels, using UTC dates
    const formattedMonthlyData = Object.entries(monthlyData)
      .sort(
        (a, b) =>
          new Date(a[0] + "-01T00:00:00Z") - new Date(b[0] + "-01T00:00:00Z")
      )
      .reduce((acc, [key, value]) => {
        // Use the first day of the month to create a label, ensuring it's in UTC
        const [year, monthIndex] = key.split("-");
        const date = new Date(Date.UTC(year, monthIndex - 1, 1));
        const readableMonthYear = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
          timeZone: "UTC", // Explicitly use UTC for labeling
        });
        acc[readableMonthYear] = value;
        return acc;
      }, {});

    return formattedMonthlyData;
  };

  const calculateYTDTotals = () => {
    return golfRoundsData.reduce((total, item) => {
      if (new Date(item.date).getFullYear().toString() === selectedYear) {
        return total + item.roundsPlayed;
      }
      return total;
    }, 0);
  };

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

  const monthlyData = groupDataByMonth(
    selectedYear
      ? golfRoundsData.filter(
          (item) =>
            new Date(item.date).getFullYear().toString() === selectedYear
        )
      : golfRoundsData
  );

  const filteredData = selectedYear
    ? golfRoundsData.filter(
        (item) => new Date(item.date).getFullYear().toString() === selectedYear
      )
    : golfRoundsData;

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
      {/* Display Yearly and Quarterly Totals */}
      {selectedYear && (
        <>
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
      <Grid container spacing={2}>
        {Object.entries(monthlyData).map(([monthYear, data]) => (
          <Grid item xs={12} sm={6} md={4} key={monthYear}>
            <Typography variant="h6" gutterBottom>
              {monthYear}
            </Typography>

            <DataGrid
              rows={data}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              getRowId={(row) => row.id}
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
                // borderRadius: theme.shape.borderRadius,
                marginBottom: theme.spacing(2),
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default History;
