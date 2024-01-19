import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for managing checkbox selections
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    text: false,
    push: false,
  });

  // Handler for changing checkbox state
  const handleCheckboxChange = (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [event.target.name]: event.target.checked,
    });
  };

  // Custom checkbox styling for dark mode
  const checkboxStyle =
    theme.palette.mode === "dark"
      ? {
          color: colors.greenAccent[700],
          "&.Mui-checked": {
            color: colors.greenAccent[700],
          },
        }
      : {};

  // Custom text color for light mode
  const textColorLightMode =
    theme.palette.mode === "light" ? colors.grey[800] : colors.blueAccent[100];

  // Custom button color for light mode
  const buttonColorLightMode =
    theme.palette.mode === "light" ? colors.blueAccent[200] : colors.greenAccent[700];

  return (
    <Box p="20px">
      <Header title="SETTINGS" subtitle="Update Account Settings" />

      {/* Notifications Section */}
      <Typography variant="h4" color={textColorLightMode}>
        Notifications
      </Typography>
      <Typography variant="subtitle1" color={colors.greenAccent[500]}>
        Manage Notifications
      </Typography>

      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={notificationSettings.email}
              onChange={handleCheckboxChange}
              name="email"
              sx={checkboxStyle}
            />
          }
          label="Email"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={notificationSettings.text}
              onChange={handleCheckboxChange}
              name="text"
              sx={checkboxStyle}
            />
          }
          label="Text Messages"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={notificationSettings.push}
              onChange={handleCheckboxChange}
              name="push"
              sx={checkboxStyle}
            />
          }
          label="Push Notifications"
        />
      </Box>

      {/* Save Button for Notifications */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: theme.spacing(2),
          backgroundColor: buttonColorLightMode,
        }}
      >
        Save
      </Button>

      {/* Password Section */}
      <Box mt="40px">
        <Typography variant="h4" color={textColorLightMode}>
          Password
        </Typography>
        <Typography variant="subtitle1" color={colors.greenAccent[500]}>
          Update Password
        </Typography>

        {/* Update Password Form */}
        <form>
          <Box mt="20px">
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                style: { color: colors.greenAccent[300] },
              }}
            />
            <TextField
              label="Update Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                style: { color: colors.greenAccent[300] },
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              marginTop: theme.spacing(2),
              backgroundColor: buttonColorLightMode,
            }}
          >
            Update Password
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Settings;
