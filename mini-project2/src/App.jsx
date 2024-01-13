import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from  "./scenes/Sidebar"
import Dashboard from "./scenes/dashboard";
import Reports from "./scenes/reports";
import History from "./scenes/history";
import Upload from "./scenes/Upload";
import ForeCast from "./scenes/forecast";
import Calender from "./scenes/calender";
import Team from "./scenes/team"
import { Route, Routes } from "react-router-dom";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/history" element={<History />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/forecast" element={<ForeCast />} />
              <Route path="/calendar" element={<Calender />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
