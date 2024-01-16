import { Box } from "@mui/material";
import Header from "../../components/Header";

const Weather = () => {
    return (
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Weather" subtitle="Your Weather Forecast" />
        </Box>
      </Box>
    );
  };
  
  export default Weather;