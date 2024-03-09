import React from "react";
import { Box, TextField } from "@mui/material";

const DateSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  const handleStartDateChange = (event) => {
    onStartDateChange(event.target.value);
  };

  const handleEndDateChange = (event) => {
    onEndDateChange(event.target.value);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        InputLabelProps={{ shrink: true }}
        style={{ marginRight: "10px", width: "50%" }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        InputLabelProps={{ shrink: true }}
        style={{ width: "50%" }}
      />
    </Box>
  );
};

export default DateSelector;