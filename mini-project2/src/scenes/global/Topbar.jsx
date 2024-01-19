import React, { useState, useContext } from "react";
import {
  Box, 
  IconButton, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Popover, 
  useTheme, 
  InputBase, 
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme"; 
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import QuizIcon from "@mui/icons-material/Quiz";
import { Link } from "react-router-dom"; 

const Topbar = () => {
  const theme = useTheme(); // Access the current theme
  const colors = tokens(theme.palette.mode); // Access color tokens based on the current theme mode
  const colorMode = useContext(ColorModeContext); // Access color mode context for theme toggling

  const [selectedIndex, setSelectedIndex] = useState(0); // State for tracking the selected index in the list
  const [anchorEl, setAnchorEl] = useState(null); // State for managing the anchor of the Popover

  // Function to handle list item click
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index); // Set the selected index
    setAnchorEl(null); // Close the Popover
  };

  // Function to handle the opening of the profile menu
  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor to the current button
  };

  // Function to close the Popover
  const handleClose = () => {
    setAnchorEl(null); // Clear the anchor, closing the Popover
  };

  // Function to handle logout logic (to be implemented)
  const handleLogout = () => {
    console.log("Logout Clicked"); // Placeholder for actual logout logic
    handleClose(); // Close the Popover
  };

  const open = Boolean(anchorEl); // Determine if the Popover is open
  const id = open ? "profile-popover" : undefined; // ID for the Popover

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Search Bar */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Icons for various functionalities */}
      <Box display="flex">
        {/* Toggle button for light/dark theme */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>

        {/* Notification icon */}
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>


        {/* User profile icon */}
        <IconButton onClick={handleProfileMenu}>
          <PersonOutlinedIcon />
        </IconButton>

        {/* Profile dropdown menu */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <List
            component="nav"
            sx={{
              p: 0,
              "& .MuiListItemIcon-root": {
                minWidth: 32,
                color: theme.palette.grey[500],
              },
            }}
          >
            {/* Edit Profile option */}
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>

            {/* FAQ option with navigation to /faq */}
            <ListItemButton
              component={Link}
              to="/faq"
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
            >
              <ListItemIcon>
                <QuizIcon />
              </ListItemIcon>
              <ListItemText primary="FAQ" />
            </ListItemButton>

            {/* Settings option */}
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemIcon>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>

            {/* Logout option */}
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={handleLogout}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Popover>
      </Box>
    </Box>
  );
};

export default Topbar;
