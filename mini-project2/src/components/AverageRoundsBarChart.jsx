import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Box, Typography } from "@mui/material";

// Define the AverageRoundsBarChart component
const AverageRoundsBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // useEffect hook to fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8082/api/dailyRounds");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData = await response.json();
        setData(fetchedData); // Assuming the data is directly usable
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useMemo hook to calculate the average rounds per day, ensuring this computation
  // is memoized and only re-run when data, loading, or error state changes
  const averageRoundsData = useMemo(() => {
    if (loading || error || !data) {
      return [];
    }

    // Transform data to calculate the average rounds per day
    const daysMap = data.reduce((acc, { date, rounds_played }) => {
      const dayOfWeek = new Date(date + "T12:00:00Z").toLocaleString("en-US", {
        weekday: "long",
      });
      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = [];
      }
      acc[dayOfWeek].push(rounds_played);
      return acc;
    }, {});

    // Map over the daysMap object to create the final structure for the bar chart
    return Object.keys(daysMap).map((day) => ({
      day: day,
      average: Math.round(
        daysMap[day].reduce((sum, curr) => sum + curr, 0) / daysMap[day].length
      ),
    }));
  }, [data, loading, error]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;
  // Render the bar chart inside a Box component
  return (
    <Box
      mt="30px"
      p="40px"
      style={{
        height: "500px",
        backgroundColor: colors.primary[400],
      }}
    >
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          color: colors.grey[100],
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        Average Rounds Per Day
      </Typography>
      <ResponsiveBar
        data={averageRoundsData} // Data for the bar chart
        keys={["average"]} // Keys to determine the bars
        indexBy="day" // Indexing by day of the week
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "set3" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Day of the Week",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Average Rounds",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        // Additional theme settings
        theme={{
          text: {
            fill: colors.greenAccent[500],
          },
          textColor: colors.grey[100],
          fontSize: theme.typography.h5.fontSize,
          axis: {
            legend: {
              text: {
                fill: colors.greenAccent[500],
              },
            },
          },
          tooltip: {
            container: {
              background: colors.primary[500],
              color: colors.grey[100],
            },
          },
        }}
        legends={
          [
            // ... legends settings ...
          ]
        }
        role="application"
        ariaLabel="Average rounds per day bar chart"
        barAriaLabel={(e) =>
          `${e.id}: ${e.formattedValue} average rounds on ${e.indexValue}`
        }
      />
    </Box>
  );
};

export default AverageRoundsBarChart;
