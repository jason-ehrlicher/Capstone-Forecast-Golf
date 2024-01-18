import { Box } from "@mui/material";
import Header from "../../components/Header";

// Forecast component definition
const Forecast = () => {
  // Rendering the Forecast component
  return (
    <Box m="20px">
      {/* Header component with a title and subtitle */}
      <Header
        title="ForeCast"
        subtitle="Data-Driven Trends for Informed Decisions"
      />
    </Box>
  );
};

export default Forecast;
