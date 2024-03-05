import { Box } from "@mui/material";
import Header from "../../components/Header";
import WeatherWidget from "../../components/WeatherWidget";
import Heatmap from "../../components/Heatmap";
import { tokens } from "../../theme";
import InputRounds from "../../components/InputRounds";
import AverageRoundsBarChart from "../../components/AverageRoundsBarChart";
import MonthLineChart from "../../components/MonthlyRoundsLinechart";
import CalendarWidget from "../../components/CalendarWidget";

// Dashboard component definition
const Dashboard = () => {
  // Rendering the Dashboard component
  return (
    <Box m="20px">
      {/* Header component with a title and subtitle */}
      <Header title="DASHBOARD" subtitle="Your Personalized Overview" />
      <WeatherWidget />
      <Box display="flex" width="100%">
        <Box flex={1} mr={2}>
          <InputRounds />
        </Box>
        <Box flex={1}>
          <CalendarWidget />
        </Box>
      </Box>
      <AverageRoundsBarChart />
      <MonthLineChart />
      <Heatmap />
    </Box>
  );
};

export default Dashboard;
