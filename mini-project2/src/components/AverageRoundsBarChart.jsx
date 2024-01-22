import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import useParseCSV from "../hooks/useParseCSV";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Box, Typography } from "@mui/material";

const AverageRoundsBarChart = () => {
  const { data, loading, error } = useParseCSV();  // Using custom hook to get CSV data
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

 // useMemo hook to calculate average rounds per day, only recalculated when data, loading, or error changes
  const averageRoundsData = useMemo(() => {
    if (loading || error) {
      return [];  // Return an empty array if data is loading or there is an error
    }

    // Reducing data to accumulate rounds per day
    const roundsPerDay = data.reduce((acc, item) => {
      const day = item.Day;
      acc[day] = acc[day] || [];
      acc[day].push(parseInt(item["Rounds Played"], 10) || 0);
      return acc;
    }, {});

    // Mapping over each day to calculate the average
    return Object.keys(roundsPerDay).map((day) => {
      const total = roundsPerDay[day].reduce((sum, rounds) => sum + rounds, 0);
      const average = Math.round(total / roundsPerDay[day].length);
      return { day, average };
    });
  }, [data, loading, error]);

  // Handling loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

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
        data={averageRoundsData}  // Data for the bar chart
        keys={["average"]}  // Keys to determine the bars
        indexBy="day"  // Indexing by day of the week
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
