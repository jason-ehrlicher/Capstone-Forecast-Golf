import React, { useContext } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import useParseCSV from "../hooks/useParseCSV";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Typography, Box } from "@mui/material";

const Heatmap = () => {
  const { data, loading, error } = useParseCSV(); // Using the custom hook
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Transform data to the format expected by Nivo Calendar
  const transformedData = data.map((item) => ({
    day: item.Date,
    value: item["Rounds Played"],
  }));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <Box mb="0px" style={{ height: "500px" }}>
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          color: colors.grey[100],
        }}
      >
        Rounds Played Heatmap
      </Typography>
      <ResponsiveCalendar
        data={transformedData}
        from="2023-01-01"
        to={transformedData[transformedData.length - 1].day}
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
      />
    </Box>
  );
};

export default Heatmap;
