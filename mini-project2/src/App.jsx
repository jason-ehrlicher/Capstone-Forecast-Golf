import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Reports from "./scenes/reports";
import History from "./scenes/history";
import Upload from "./scenes/Upload";
import ForeCast from "./scenes/forecast";
import Calendar from "./scenes/calendar";
import Team from "./scenes/team";
import Landing from "./scenes/landing";
import { Route, Routes, useLocation as useAppLocation } from "react-router-dom";
import Weather from "./scenes/weather";
import FAQ from "./scenes/faq";

// Main App component

function App() {

  // Using a custom hook to manage the theme and color mode
  const [theme, colorMode] = useMode();

  // Hook to access the current location (URL path)
  const appLocation = useAppLocation();

  // Determining if the current page is the landing page
  const isLandingPAge = appLocation.pathname === "/";

  return (

     // Providing the color mode context to the application
    <ColorModeContext.Provider value={colorMode}>

      {/* Applying the theme to the entire application */}
      <ThemeProvider theme={theme}>
        <CssBaseline />

         {/* Main application layout */}
        <div className="App" style={{ display: "flex", height: "100vh" }}>

          {/* Conditionally rendering the Sidebar if not on the landing page */}
          {!isLandingPAge && <Sidebar />}
          <div className="main-content" style={{ flex: 1, overflow: "auto" }}>

            {/* Conditionally rendering the Topbar if not on the landing page */}
            {!isLandingPAge && <Topbar />}

             {/* Router setup for navigating between different scenes */}
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/team" element={<Team />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/history" element={<History />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/forecast" element={<ForeCast />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
