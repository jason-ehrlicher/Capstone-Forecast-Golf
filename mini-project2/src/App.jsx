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
import Settings from "./scenes/settings";
import Account from "./scenes/account";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./scenes/contact";

// Main App component

function App() {
  // Using a custom hook to manage the theme and color mode
  const [theme, colorMode] = useMode();

  // Hook to access the current location (URL path)
  const appLocation = useAppLocation();

  // Determining if the current page is the landing page
  const isLandingPAge = appLocation.pathname === "/";

  return (
    <AuthProvider>
      {/* // Providing the color mode context to the application */}
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
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/weather" element={<ProtectedRoute><Weather /></ ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute><Team /></ ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ ProtectedRoute>} />
                <Route path="/forecast" element={<ProtectedRoute><ForeCast /></ ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ ProtectedRoute>} />
                <Route path="/faq" element={<ProtectedRoute><FAQ /></ ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><Account /></ ProtectedRoute>} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
