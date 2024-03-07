import React from "react";
import { useAuth } from "../context/AuthContext";
import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

function Welcome() {
  const { user } = useAuth();
  const firstName = user?.user?.firstName;

  // Accessing the theme for styling
  const theme = useTheme();

  // Extracting color tokens based on the current theme mode
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ padding: theme.spacing(2) }}>
      {firstName ? (
        // Welcome message with user's name
        <Typography
          variant="h5"
          color={colors.primary.main}
          sx={{ mb: theme.spacing(1) }}
        >
          Welcome, {firstName}!
        </Typography>
      ) : (
        // Message displayed if no user is logged in
        <Typography
          variant="h5"
          color={colors.primary.main}
          sx={{ mb: theme.spacing(1) }}
        >
          Please Log In
        </Typography>
      )}
    </Box>
  );
}

export default Welcome;
