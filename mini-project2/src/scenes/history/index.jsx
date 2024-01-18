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
  // Access the theme to use in styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for storing the selected year
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
    // Splitting the dateString into parts (year, month, day)
    const parts = dateString.split("-");
    // Check if dateString format is correct (YYYY-MM-DD)
    if (parts.length === 3) {
      // Parse each part into integers and construct a Date object
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day); // Return a new Date object constructed from year, month, and day
    }
    // Return null if format is incorrect
    return null;
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
      /// Exclude data not matching the selected year
      if (selectedYear && parsedDate.getFullYear() !== selectedYear) {
        return;
      }
      // Format the date to a readable Month-Year string
      const monthYear = parsedDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      // Initialize the array for each month-year if it doesn't exist
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = [];
      }
      // Push the item into the respective month-year array
      monthlyData[monthYear].push({
        ...item,
        uniqueId: `${monthYear}-${index}`, // Generating a unique ID
      });
    });
    return monthlyData;
  };

  // Generating a unique ID
  const calculateYTDTotals = (data) => {
    if (!selectedYear) return 0; // Return 0 if no year is selected
    // Use the reduce function to iterate over each item in the data array
    return data.reduce((sum, item) => {
      const parsedDate = parseDate(item.Date);
      // Sum up 'Rounds Played' for the selected year
      if (parsedDate && parsedDate.getFullYear() === selectedYear) {
        const roundsPlayed = parseInt(item["Rounds Played"], 10);  //Radix specified as 10 to avoid unexpected results
        return sum + (isNaN(roundsPlayed) ? 0 : roundsPlayed);
      }
      return sum;
    }, 0);
  };

  // Function to render each month's DataGrid
  const renderMonthDataGrid = (monthYear, monthData, totalRoundsPlayed) => {
    // Prepare data for rendering, including a total row for each month
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
              // Styling for the DataGrid component
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

      {/* Dropdown selector for year filter */}
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

      {/* Display YTD total box if a year is selected */}
      {selectedYear && (
        <Box mb={4} p={2} bgcolor={colors.blueAccent[700]} color="white">
          <Typography variant="h2" textAlign="center">
            Total Rounds Played in {selectedYear}: {calculateYTDTotals(data)}
          </Typography>
        </Box>
      )}
      {/* Render DataGrids for each month */}
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
