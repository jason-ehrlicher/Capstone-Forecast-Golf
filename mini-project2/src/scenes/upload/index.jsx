import React, { useState } from "react";
import { Button, Typography, Box, Paper, Input, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Upload = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileType = file.type;
    if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileType === "application/vnd.ms-excel" || file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert("Please select an Excel or CSV file.");
      event.target.value = null; // Reset the input
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Implement file upload logic here
      console.log("Uploading file:", selectedFile.name);
    }
  };

  return (
    <Box m="20px">
      <Header title="UPLOAD" subtitle="Securely Add Your Data" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          p: 4,
          "& .MuiPaper-root": {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
          },
          "& .MuiButton-root": {
            backgroundColor: colors.greenAccent[600],
            '&:hover': {
              backgroundColor: colors.greenAccent[500],
            },
          },
          "& .MuiInput-root": {
            borderBottom: `1px solid ${colors.greenAccent[700]}`,
            color: colors.grey[100],
          },
        }}
      >
        <Typography variant="h3" gutterBottom>
          Upload Excel/CSV File
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            mt: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "60%",
            maxWidth: "600px",
            minHeight: "200px",
            backgroundColor: colors.primary[500],
            color: colors.grey[100],
          }}
        >
          <Input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            sx={{ mb: 2, color: colors.grey[100] }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload File
          </Button>
          {selectedFile && (
            <Typography variant="subtitle1" sx={{ mt: 2, color: colors.grey[100] }}>
              File selected: {selectedFile.name}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Upload;
