import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PollIcon from "@mui/icons-material/Poll";
import HistoryIcon from "@mui/icons-material/History";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SettingsIcon from "@mui/icons-material/Settings";
import logo from "../assets/forecast golf logo1.png";



function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          boxSizing: "border-box",
          backgroundColor: "#344e41",
          color: "#dad7cd",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}
        component="a"
        href="/dashboard.html"
      >
        <img src={logo} alt="Logo" style={{ maxHeight: "200px" }} />
      </Box>
      <List>
        {[
          { href: "/dashboard.html", icon: <DashboardIcon />, text: "Dashboard" },
          { href: "/reports.html", icon: <PollIcon />, text: "Reports" },
          { href: "/history.html", icon: <HistoryIcon />, text: "History" },
          { href: "/upload.html", icon: <FileUploadIcon />, text: "Upload" },
          { href: "/forecast.html", icon: <PsychologyIcon />, text: "ForeCast" },
          { href: "/settings.html", icon: <SettingsIcon />, text: "Settings" }
        ].map((item, index) => (
          <ListItem
            key={index}
            component="a"
            href={item.href}
            sx={{
              color: "inherit",
              padding: "10px 20px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "#a3b18a",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box />
    </Drawer>
  );
}

export default Sidebar;
