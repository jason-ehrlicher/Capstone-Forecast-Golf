import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
  Snackbar,
  Alert,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import HankHill from "/assets/Hank_Hill.jpg";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
// import { FormControl } from "@mui/material";
// import UpdateModal from "../../components/UpdateModal";

const Account = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, updateUserContext } = useAuth();
  const [errors, setErrors] = useState({ email: "", phoneNumber: "" });

  // const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    console.log("Profile Current User: ", user);
    console.log("Phone num:", user?.user?.phoneNumber);
  }, [user]);

  // Function to validate email format
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Function to format the phone number
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6)
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  // Initial state setup with user data
  const [userData, setUserData] = useState({
    id: user?.user?.id || null,
    firstName: user?.user?.firstName || "",
    lastName: user?.user?.lastName || "",
    email: user?.user?.email || "",
    phoneNumber: formatPhoneNumber(user?.user?.phoneNumber) || "", // Format the phone number upon initial setup
  });

  // Handle form field changes
  const handleChange = (prop) => (event) => {
    const { value } = event.target;
    if (prop === "email") {
      const isValid = validateEmail(value);
      setErrors({ ...errors, email: isValid ? "" : "Invalid email format" });
      setUserData({ ...userData, [prop]: value });
    } else if (prop === "phoneNumber") {
      const formattedPhoneNumber = formatPhoneNumber(value);
      setUserData({ ...userData, [prop]: formattedPhoneNumber });
    } else {
      setUserData({ ...userData, [prop]: value });
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const response = await fetch(`http://localhost:8082/api/users/${userData.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         firstName: userData.firstName,
  //         lastName: userData.lastName,
  //         email: userData.email,
  //         phoneNumber: userData.phoneNumber.replace(/[^\d]/g, ""), // Ensuring phone number format
  //       }),
  //     });

  //     if (response.ok) {
  //       const updatedUserData = await response.json();
  //       updateUserContext({ ...user, ...updatedUserData }); // Ensure this merges as expected
  //       // alert("Profile updated successfully.");
  //       setUpdateModalOpen(true);
  //     } else {
  //       const result = await response.json();
  //       throw new Error(result.message || "Failed to update user.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     alert("Error updating profile: " + error.message);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Updated to show Snackbar on successful update
    try {
      const response = await fetch(
        `http://localhost:8082/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber.replace(/[^\d]/g, ""),
          }),
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json();
        updateUserContext({ ...user, ...updatedUserData });
        setSnackbar({
          open: true,
          message: "Profile updated successfully.",
          severity: "success",
        });
      } else {
        throw new Error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "Error updating profile: " + error.message,
        severity: "error",
      });
    }
  };
  return (
    <Box p="20px">
      <Header title="ACCOUNT" subtitle="Manage Your Account" />

      {/* <>
        <UpdateModal
          open={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
        />
      </> */}
     {/* Snackbar for confirmation messages */}
     <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Avatar Section */}
      <Box mt="40px" display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={HankHill}
          sx={{ width: theme.spacing(10), height: theme.spacing(10) }}
        />
        <Typography color={colors.grey[200]}>ADMIN</Typography>
        {/* Additional user information can be displayed here */}
      </Box>

      {/* Profile Section */}
      <Box mt="40px" display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" color={colors.grey[100]}>
          Profile
        </Typography>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userData.firstName}
            onChange={handleChange("firstName")}
            InputLabelProps={{
              style: { color: colors.greenAccent[300] },
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userData.lastName}
            onChange={handleChange("lastName")}
            InputLabelProps={{
              style: { color: colors.greenAccent[300] },
            }}
          />
          {/* Email Field with validation */}
          <FormControl
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.email}
          >
            <TextField
              label="Email Address"
              variant="outlined"
              value={userData.email}
              onChange={handleChange("email")}
              InputLabelProps={{ style: { color: colors.greenAccent[300] } }}
            />
            {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
          </FormControl>
          {/* Phone Number Field */}
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            InputLabelProps={{ style: { color: colors.greenAccent[300] } }}
          />
          <Box textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: colors.greenAccent[500] }}
            >
              Save Profile
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Account;
