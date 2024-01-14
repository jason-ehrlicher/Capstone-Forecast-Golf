import { Box } from "@mui/material";
import Header from "../../components/Header";

const Forecast = () => {
    return (
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="ForeCast" subtitle="Data-Driven Trends for Informed Decisions" />
        </Box>
      </Box>
    );
  };
  
  export default Forecast;