import { Box } from "@mui/material";
import Header from "../../components/Header";
import AverageRoundsBarChart from "../../components/AverageRoundsBarChart";
import MonthLineChart from "../../components/MonthlyRoundsLinechart";
import Heatmap from "../../components/Heatmap";



// Reports component definition
const Reports = () => {
  // Rendering the Reports component
  return (
    <>
    <Box m="20px">
      {/* Header component with a title and subtitle */}
      <Header title="REPORTS" subtitle="Insights from Your Data" />
    </Box>
    <Box m="20px">
    <AverageRoundsBarChart />
      <MonthLineChart />
      <Heatmap />
    </Box>
    </>
  );
};

export default Reports;
