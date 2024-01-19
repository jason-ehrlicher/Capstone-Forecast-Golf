import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import useParseCSV from "../hooks/useParseCSV";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Box, Typography } from "@mui/material";

const MonthLineChart = () => {
  const { data, loading, error } = useParseCSV();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Function to format month-year as 'MMM YY'
  const formatMonthYear = (date) => {
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().substr(-2);
    return `${month} '${year}`;
  };

  // Calculate total rounds per month
  const totalRoundsPerMonth = useMemo(() => {
    if (loading || error) {
      return [];
    }

    const roundsByMonth = {};
    data.forEach((item) => {
      const date = new Date(item.Date);
      const monthYear = formatMonthYear(date);
      roundsByMonth[monthYear] =
        (roundsByMonth[monthYear] || 0) + parseInt(item["Rounds Played"], 10);
    });

    const last12MonthsData = Object.entries(roundsByMonth)
      .map(([monthYear, totalRounds]) => ({ x: monthYear, y: totalRounds }))
      .slice(-12); // Get last 12 months

    return [{ id: "Rounds", data: last12MonthsData }];
  }, [data, loading, error]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

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
          marginBottom: "20px",
        }}
      >
        Total Rounds Played Per Month
      </Typography>
      <ResponsiveLine
        data={totalRoundsPerMonth}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Month",
          legendOffset: 36,
          legendPosition: "middle",
          format: (value) => value, // Full month-year format is shown
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Total Rounds",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "seriesColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={{
          text: {
            fill: colors.greenAccent[500],
          },
          textColor: colors.grey[100],
          fontSize: theme.typography.h6.fontSize,
          axis: {
            legend: {
              text: {
                fill: colors.greenAccent[500],
              },
            },
          },
          grid: {
            line: {
              stroke: colors.grey[700],
            },
          },
          tooltip: {
            container: {
              background: colors.primary[500],
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
    </Box>
  );
};

export default MonthLineChart;
