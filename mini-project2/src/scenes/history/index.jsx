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
import useParseCSV from "../../hooks/useParseCSV";
import { tokens } from "../../theme";

const History = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedYear, setSelectedYear] = useState("");

  // Columns definition for DataGrid
  const columns = [
    { field: "Date", headerName: "Date", width: 150 },
    { field: "Day", headerName: "Day", width: 130 },
    {
      field: "Rounds Played",
      headerName: "Rounds Played",
      type: "number",
      width: 130,
    },
  ];

  // Fetch data using the custom hook useParseCSV
  const { data, loading, error } = useParseCSV();

  // Loading and error handling for the CSV data
  if (loading) return <Box m="20px">Loading...</Box>;
  if (error) return <Box>Error loading data: {error.message}</Box>;

  // Function to parse a date string into a Date object
  const parseDate = (dateString) => {
    const parts = dateString.split("-"); // Split the input dateString by hyphen ("-")
    // Check if the split parts length is exactly 3 (i.e., Year, Month, Day)
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10); // Parse as integer
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day); // Return a new Date object constructed from year, month, and day
    }
    return null; // If dateString is not in the expected format, return nul
  };

  // Extract unique years from the data for the dropdown
  const years = Array.from(
    new Set(
      data
        .map((item) => {
          const date = parseDate(item.Date);
          return date ? date.getFullYear() : null;
        })
        .filter(Boolean)
    )
  ).sort();

  
  // Function to handle year selection change
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

   // Function to group data by month and year
  const groupDataByMonth = (data) => {
    const monthlyData = {};
    data.forEach((item, index) => {
      const parsedDate = parseDate(item.Date);
      // Skip if the year doesn't match the selected year
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
      monthlyData[monthYear].push({
        ...item,
        uniqueId: `${monthYear}-${index}`,
      });
    });
    return monthlyData;
  };

  const calculateYTDTotals = (data) => {
    if (!selectedYear) return 0;
    return data.reduce((sum, item) => {
      const parsedDate = parseDate(item.Date);
      if (parsedDate && parsedDate.getFullYear() === selectedYear) {
        const roundsPlayed = parseInt(item["Rounds Played"], 10);
        return sum + (isNaN(roundsPlayed) ? 0 : roundsPlayed);
      }
      return sum;
    }, 0);
  };

  // Function to render each month's DataGrid
  const renderMonthDataGrid = (monthYear, monthData, totalRoundsPlayed) => {
    const dataWithTotal = [
      ...monthData,
      {
        uniqueId: `${monthYear}-total`,
        Date: "Total",
        Day: "",
        "Rounds Played": totalRoundsPlayed,
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
              getRowId={(row) => row.uniqueId}
            />
          </Box>
        </Box>
      </Grid>
    );
  };

  // Rendering the History component
  return (
    <Box m="20px">
      <Header title="HISTORY" subtitle="Daily Rounds Played Archive" />

      {/* Select box for year filter */}
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

      {/* Conditionally render YTD total box */}
      {selectedYear && (
        <Box mb={4} p={2} bgcolor={colors.blueAccent[700]} color="white">
          <Typography variant="h2" textAlign="center">
            Total Rounds Played in {selectedYear}: {calculateYTDTotals(data)}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {Object.entries(groupDataByMonth(data)).map(
          ([monthYear, monthData]) => {
            const totalRoundsPlayed = monthData.reduce(
              (sum, item) => sum + parseInt(item["Rounds Played"], 10),
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
