import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import logo from "/assets/forecast golf logo1.png";

// Item component for individual menu items
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title} // Highlighting the active item
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)} // Setting the selected item
      icon={icon} // Icon for the menu item
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

// Sidebar component definition
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false); // State for collapsing the sidebar
  const [selected, setSelected] = useState("Dashboard"); // State for the selected menu item

  return (
    <Box
      sx={{
        // Styling for the sidebar
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item: hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      {/* Main sidebar structure using ProSidebar */}
      <ProSidebar collapsed={isCollapsed}>
         {/* Menu component to hold all menu items */}
        <Menu iconShape="square">
         {/* Menu item for toggling the sidebar's collapsed state */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)} // Toggle function
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined} // Icon for the menu item
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
             {/* Displaying the 'ADMIN' label and toggle icon when sidebar is not collapsed */}
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

            {/* Logo section, displayed only when the sidebar is not collapsed */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="logo"
                  width="200px"
                  height="200px"
                  src={logo}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  ForeCast Golf
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Data-Driven Decisions
                </Typography>
              </Box>
            </Box>
          )}
           {/* Menu items for navigation */}
          <Box paddingLeft={isCollapsed ? undefined : "10px"}>

             {/* Section title for 'Operations' */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Operations
            </Typography>

             {/* Individual menu items for different pages */}
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<DashboardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarMonthOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Weather"
              to="/weather"
              icon={<ThermostatOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Section title for 'Data' */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Reports"
              to="/reports"
              icon={<PollOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Historical Data"
              to="/history"
              icon={<HistoryOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Upload"
              to="/upload"
              icon={<UploadOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ForeCast"
              to="/forecast"
              icon={<PsychologyOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
