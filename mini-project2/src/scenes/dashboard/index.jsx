import { Box } from "@mui/material";
import Header from "../../components/Header";
import WeatherWidget from "../../components/WeatherWidget";

// Dashboard component definition
const Dashboard = () => {

  // Rendering the Dashboard component
  return (
    <Box m="20px">

      {/* Header component with a title and subtitle */}
      <Header title="DASHBOARD" subtitle="Your Personalized Overview" />

       {/* WeatherWidget component to display weather information */}
      <WeatherWidget />
    </Box>
  );
};

export default Dashboard;
