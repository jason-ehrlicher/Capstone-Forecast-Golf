import { Box } from "@mui/material";
import Header from "../../components/Header";
import AverageRoundsBarChart from "../../components/AverageRoundsBarChart";
import MonthLineChart from "../../components/MonthlyRoundsLinechart";
import Heatmap from "../../components/Heatmap";
import DateSelector from "../../components/DateSelector";
import { useState } from "react";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <>
      <Box m="20px">
        <Header title="REPORTS" subtitle="Insights from Your Data" />
      </Box>
      <Box m="20px">
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        <AverageRoundsBarChart startDate={startDate} endDate={endDate} />
        <MonthLineChart startDate={startDate} endDate={endDate} />
        <Heatmap startDate={startDate} endDate={endDate} />
      </Box>
    </>
  );
};

export default Reports;