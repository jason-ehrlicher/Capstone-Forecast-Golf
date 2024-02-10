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
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8082/rounds-played");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = Object.entries(data).map(
          ([date, details], index) => ({
            id: index,
            Date: date,
            Day: details.day,
            "Rounds Played": details.roundsPlayed,
            "Weather Icon": details.weatherIcon,
            ...details,
          })
        );
        setFetchedData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "Date", headerName: "Date", flex: 1 },
    { field: "Day", headerName: "Day", flex: 1 },
    {
      field: "Rounds Played",
      headerName: "Rounds Played",
      type: "number",
      flex: 1,
    },
    {
      field: "Weather Icon",
      headerName: "Weather",
      flex: 1,
      renderCell: (params) => {
        if (params.row.Date !== "Total") {
          const iconUrl = `http://openweathermap.org/img/wn/${params.value}@2x.png`;

          const tooltipContent = (
            <div>
              <p>Feels Like: {params.row.averageFeelsLike}°F</p>
              <p>Temp Min: {params.row.averageTempMin}°F</p>
              <p>Temp Max: {params.row.averageTempMax}°F</p>
              <p>Pressure: {params.row.averagePressure} hPa</p>
              <p>Humidity: {params.row.averageHumidity}%</p>
              <p>Wind Speed: {params.row.averageWindSpeed} mph</p>
              <p>Wind Gust: {params.row.averageWindGust} mph</p>
              <p>Rain: {params.row.rainTotal} mm</p>
              <p>Snow: {params.row.snowTotal} mm</p>
              <p>Main: {params.row.weatherMain}</p>
              <p>Description: {params.row.weatherDescription}</p>
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
        return null;
      },
    },
  ];

  const years = Array.from(
    new Set(fetchedData.map((item) => new Date(item.Date).getFullYear()))
  ).sort();

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const groupDataByMonth = (data) => {
    const monthlyData = {};
    data.forEach((item) => {
      const parsedDate = new Date(item.Date + "T00:00:00");
      if (selectedYear && parsedDate.getFullYear() !== selectedYear) {
        return;
      }
      const monthYear = parsedDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = [];
      }
      monthlyData[monthYear].push(item);
    });
    return monthlyData;
  };

  const calculateYTDTotals = (data) => {
    if (!selectedYear) return 0;
    return data.reduce((sum, item) => {
      const parsedDate = new Date(item.Date);
      if (parsedDate.getFullYear() === selectedYear) {
        return sum + item["Rounds Played"];
      }
      return sum;
    }, 0);
  };

  const calculateQuarterlyTotals = (data, year) => {
    const quarterlyTotals = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

    data.forEach((item) => {
      const parsedDate = new Date(item.Date);
      const month = parsedDate.getMonth() + 1; // JavaScript months are 0-indexed
      const itemYear = parsedDate.getFullYear();

      if (itemYear === year) {
        if (month >= 1 && month <= 3) {
          quarterlyTotals.Q1 += item["Rounds Played"];
        } else if (month >= 4 && month <= 6) {
          quarterlyTotals.Q2 += item["Rounds Played"];
        } else if (month >= 7 && month <= 9) {
          quarterlyTotals.Q3 += item["Rounds Played"];
        } else if (month >= 10 && month <= 12) {
          quarterlyTotals.Q4 += item["Rounds Played"];
        }
      }
    });

    return quarterlyTotals;
  };

  const renderMonthDataGrid = (monthYear, monthData, totalRoundsPlayed) => {
    const dataWithTotal = [
      ...monthData,
      {
        id: `${monthYear}-total`,
        Date: "Total",
        Day: "",
        "Rounds Played": totalRoundsPlayed,
        "Weather Icon": "",
      },
    ];

    return (
      <Grid key={monthYear} item xs={12} sm={6} md={4}>
        <Box mb={5} textAlign="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            {monthYear}
          </Typography>
          <Box
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
            }}
          >
            <DataGrid
              rows={dataWithTotal}
              columns={columns}
              pageSize={6}
              rowsPerPageOptions={[6]}
              getRowId={(row) => row.id}
            />
          </Box>
        </Box>
      </Grid>
    );
  };

  return (
    <Box m="20px">
      <Header title="HISTORICAL DATA" subtitle="Daily Rounds Played Archive" />
      <Box mb={4}>
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
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
              Total Rounds Played in {selectedYear}:{" "}
              {calculateYTDTotals(fetchedData)}
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
              {Object.entries(
                calculateQuarterlyTotals(fetchedData, parseInt(selectedYear))
              ).map(([quarter, total]) => (
                <Grid item xs={12} sm={3} key={quarter}>
                  <Typography
                    textAlign="center"
                    sx={{ fontSize: "1.5rem", color: "white" }}
                  >
                    {quarter}: {total}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
      <Grid container spacing={2}>
        {Object.entries(groupDataByMonth(fetchedData)).map(
          ([monthYear, monthData]) => {
            const totalRoundsPlayed = monthData.reduce(
              (sum, item) => sum + item["Rounds Played"],
              0
            );
            return renderMonthDataGrid(monthYear, monthData, totalRoundsPlayed);
          }
        )}
      </Grid>
    </Box>
  );
};

export default History;
