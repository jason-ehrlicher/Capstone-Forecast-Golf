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
  Avatar,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import QuizIcon from "@mui/icons-material/Quiz";
import HankHill from "/assets/Hank_Hill.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Welcome from "../../components/Welcome";
import { useAuth } from "../../context/AuthContext";
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

const Topbar = () => {
  const theme = useTheme(); // Access the current theme
  const colors = tokens(theme.palette.mode); // Access color tokens based on the current theme mode
  const colorMode = useContext(ColorModeContext); // Access color mode context for theme toggling

  const { logout } = useAuth();

  const [selectedIndex, setSelectedIndex] = useState(0); // State for tracking the selected index in the list
  const [anchorEl, setAnchorEl] = useState(null); // State for managing the anchor of the Popover
  const navigate = useNavigate();

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

  // Function to handle logout logic
  const handleLogout = () => {
    logout(); // Call logout from AuthProvider
    navigate("/"); 
  };

  const open = Boolean(anchorEl); // Determine if the Popover is open
  const id = open ? "profile-popover" : undefined; // ID for the Popover

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
      {/* Search Bar on the left
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      {/* Welcome component in the middle */}
      <Welcome />

      {/* Icons on the right */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleProfileMenu}>
          <Avatar src={HankHill} sx={{ width: 24, height: 24 }} />
        </IconButton>

        {/* Profile dropdown menu */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
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
            <ListItemButton
              component={Link}
              to="/account"
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>
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
            <ListItemButton
              component={Link}
              to="/settings"
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemIcon>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/contact"
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemIcon>
                <ContactSupportOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Contact Us" />
            </ListItemButton>
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
