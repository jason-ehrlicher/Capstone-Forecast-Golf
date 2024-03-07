import React, { useState, useEffect } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Typography, Box } from "@mui/material";

const Heatmap = () => {
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

        // Format the data to match the structure expected by ResponsiveCalendar
        const formattedData = fetchedData.map(({ date, rounds_played }) => ({
          day: date,
          value: rounds_played,
        }));
        setData(formattedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  // Determine the 'from' and 'to' dates for the calendar
  const calendarFrom = "2023-01-01";
  const calendarTo = data.length > 0 ? data[data.length - 1].day : "2023-12-31";

  // Main component render return
  return (
    <Box
      mt="30px"
      style={{ height: "500px", backgroundColor: colors.primary[400] }}
    >
      <Typography
        variant="h4"
        style={{
          padding: "10px",
          textAlign: "center",
          color: colors.grey[100],
        }}
      >
        Rounds Played Heatmap
      </Typography>
      <ResponsiveCalendar
        data={data}
        from={calendarFrom}
        to={calendarTo}
        emptyColor="#eeeeee"
        colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
        margin={{ top: 40, right: 40, bottom: 80, left: 40 }}
        yearSpacing={40}
        yearLegendOffset={6}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        theme={{
          text: {
            fill: colors.greenAccent[500],
          },
          fontSize: theme.typography.h5.fontSize,
          tooltip: {
            container: {
              background: colors.primary[800],
              color: colors.grey[100],
            },
          },
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "row",
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: "right-to-left",
          },
        ]}
        role="application"
        ariaLabel="Average rounds per day bar chart"
        barAriaLabel={(e) =>
          `${e.id}: ${e.formattedValue} average rounds on ${e.indexValue}`
        }
      />
    </Box>
  );
};

export default Heatmap;
