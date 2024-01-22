import { Box } from "@mui/material";
import Header from "../../components/Header";
import WeatherWidget from "../../components/WeatherWidget";
import Heatmap from "../../components/Heatmap";
import { tokens } from "../../theme";
import InputRounds from "../../components/InputRounds";
import AverageRoundsBarChart from "../../components/AverageRoundsBarChart";
import MonthLineChart from "../../components/MonthlyRoundsLinechart";

// Dashboard component definition
const Dashboard = () => {
  // Rendering the Dashboard component
  return (
    <Box m="20px">
      {/* Header component with a title and subtitle */}
      <Header title="DASHBOARD" subtitle="Your Personalized Overview" />
      <WeatherWidget />
      <InputRounds />
      <AverageRoundsBarChart />
      <MonthLineChart />
      <Heatmap />
    </Box>
  );
};

export default Dashboard;
