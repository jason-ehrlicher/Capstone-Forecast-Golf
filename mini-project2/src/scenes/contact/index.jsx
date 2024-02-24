import { Box, TextField, Button, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import React, { useState } from "react";
import { tokens } from "../../theme";

// Reports component definition
const Contact = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State tom manage form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...FormDataEvent, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted", formData);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  // Rendering the Reports component
  return (
    <Box m="20px">
      {/* Header component with a title and subtitle */}
      <Header
        title="Contact Us"
        subtitle="Submit Questions, Concerns, or Feedback"
      />
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          InputLabelProps={{
            style: { color: colors.greenAccent[300] },
          }}
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{
            style: { color: colors.greenAccent[300] },
          }}
        />
        <TextField
          name="message"
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={formData.message}
          onChange={handleChange}
          InputLabelProps={{
            style: { color: colors.greenAccent[300] },
          }}
        />
        <Box textAlign="center" mt={2}>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: colors.greenAccent[500] }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Contact;
