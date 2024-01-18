import { Box } from "@mui/material";
import Header from "../../components/Header";


// History component definition
const History = () => {

  // Rendering the History component
  return (
    <Box m="20px">
       {/* Header component with a title and subtitle */}
      <Header title="HISTORY" subtitle="Daily Rounds Played Archive" />
    </Box>
  );
};

export default History;
