import { Box } from "@mui/material";
import Header from "../../components/Header";

const History = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="HISTORY" subtitle="Daily Rounds Played Archive" />
      </Box>
    </Box>
  );
};

export default History;
