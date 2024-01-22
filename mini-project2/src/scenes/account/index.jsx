import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import HankHill from "/assets/Hank_Hill.jpg";

const Account = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const textColorLightMode =
    theme.palette.mode === "light" ? colors.grey[800] : colors.blueAccent[100];

  const buttonColorLightMode =
    theme.palette.mode === "light"
      ? colors.blueAccent[200]
      : colors.greenAccent[700];

  return (
    <Box p="20px">
      <Header title="ACCOUNT" subtitle="Manage Your Account" />

      {/* Avatar Section */}
      <Box mt="40px" display="flex" flexDirection="column" alignItems="center">
        <Box
          mt="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="10px"
        >
          <Avatar
            src={HankHill}
            sx={{ width: theme.spacing(10), height: theme.spacing(10) }}
          />
          <Typography color={colors.grey[200]}>ADMIN</Typography>
          <Typography color={colors.greenAccent[500]}>
            Location: [Your Location]
          </Typography>
          <Typography color={colors.greenAccent[500]}>
            Time Zone: [Your Time Zone]
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: theme.spacing(2),
            backgroundColor: buttonColorLightMode,
          }}
        >
          Upload Picture
        </Button>
      </Box>

      {/* Profile Section */}
      <Box mt="40px" display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" color={textColorLightMode}>
          Profile
        </Typography>
        <form style={{ width: "100%" }}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { color: colors.greenAccent[300] },
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { color: colors.greenAccent[300] },
            }}
          />
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { color: colors.greenAccent[300] },
            }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { color: colors.greenAccent[300] },
            }}
          />
          <Box textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: buttonColorLightMode,
              }}
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
