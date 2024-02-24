import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const { user, updateUserContext } = useAuth();

  useEffect(() => {
    console.log("Settings Current User: ", user);
    console.log("user id: ", user?.user?.id);
  }, [user]);

  // State for managing checkbox selections
  const [notificationSettings, setNotificationSettings] = useState({
    email: user?.user?.marketingEmails || false,
    text: user?.user?.textNotifications || false,
    push: user?.user?.pushNotifications || false,
    id: user?.user?.id || null,
  });


  // Handler for changing checkbox state
  const handleCheckboxChange = async (event) => {
    const { name, checked } = event.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });

    const requestBody = {};
    if (name === "email") {
      requestBody.marketingEmails = checked;
    } else if (name === "text") {
      requestBody.textNotifications = checked;
    } else if (name === "push") {
      requestBody.pushNotifications = checked;
    }
  

    const updateBody = requestBody.email || requestBody.text || requestBody.push;

    const userId = user?.user?.id;
    console.log("Update request sent for ID:", userId);
    console.log("Request body:", JSON.stringify({ [name]: checked }));

    // Update in database
    try {
      const response = await fetch(`http://localhost:8082/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        // Assuming the backend returns the updated user object
        const updatedUser = await response.json();
        // Update user context with the updated user data
        updateUserContext(updatedUser);
        // alert("Preferences updated successfully.");
      } else {
        throw new Error("Failed to update preferences.");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Error updating preferences.");
    }
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
    theme.palette.mode === "light"
      ? colors.blueAccent[200]
      : colors.greenAccent[700];

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
      {/* <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: theme.spacing(2),
          backgroundColor: buttonColorLightMode,
        }}
      >
        Save
      </Button> */}

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
            // type="submit"
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
