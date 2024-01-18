import React, { useState, useEffect } from "react";
import { Box, useTheme, Grid, Typography } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import useParseCSV from "../../hooks/useParseCSV";
import { tokens } from "../../theme";

const History = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define columns for the data grid
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

  // Data fetching states and logic
  const { data, loading, error } = useParseCSV();

  // Loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  
  const parseDate = (dateString) => {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  const groupDataByMonth = (data) => {
    const monthlyData = {};
    data.forEach((item, index) => {
      const parsedDate = parseDate(item.Date);
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

  const findMaxRows = (monthlyData) => {
    return Math.max(
      ...Object.values(monthlyData).map((monthData) => monthData.length)
    );
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
