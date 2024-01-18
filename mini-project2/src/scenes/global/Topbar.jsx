import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { InputBase } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";


// Topbar component definition
const Topbar = () => {

   // Using Material-UI theme for styling
  const theme = useTheme();

// Accessing custom color tokens based on the theme mode
  const colors = tokens(theme.palette.mode);

    // Accessing the color mode context for theme toggling
  const colorMode = useContext(ColorModeContext);

    // Rendering the Topbar component
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Search Bar */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* Input field for search functionality */}
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="search" />

{/* Search icon button */}
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon></SearchIcon>
        </IconButton>
      </Box>
      {/* Icons for various functionalities */}
      <Box display="flex">

        {/* Toggle button for light/dark theme */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>

        {/* Notification icon */}
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

         {/* Settings icon */}
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

         {/* User profile icon */}
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
