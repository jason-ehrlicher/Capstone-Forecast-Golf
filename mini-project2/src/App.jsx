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

function App() {
  const [theme, colorMode] = useMode();
  const appLocation = useAppLocation();
  const isLandingPAge = appLocation.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App" style={{ display: "flex", height: "100vh" }}>
          {!isLandingPAge && <Sidebar />}
          <div className="main-content" style={{ flex: 1, overflow: "auto" }}>
            {!isLandingPAge && <Topbar />}
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
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
