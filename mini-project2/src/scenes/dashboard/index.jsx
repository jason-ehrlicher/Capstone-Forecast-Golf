import { Box } from "@mui/material";
import Header from "../../components/Header";
import WeatherWidget from "../../components/WeatherWidget";

const Dashboard = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="DASHBOARD" subtitle="Your Personalized Overview" />
      </Box>
      <WeatherWidget />
    </Box>
  );
};

export default Dashboard;
