import React, { useState } from "react";
import { Button, Typography, Box, Paper, Input, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Upload = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Implement your file upload logic here
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
          },
          "& .MuiButton-root": {
            backgroundColor: colors.greenAccent[600],
          },
          "& .MuiInput-root": {
            borderBottom: `1px solid ${colors.greenAccent[700]}`,
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
          }}
        >
          <Input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            sx={{ mb: 2 }}
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
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              File selected: {selectedFile.name}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Upload;
