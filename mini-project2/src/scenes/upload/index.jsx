import { Box } from "@mui/material";
import Header from "../../components/Header";

const Upload = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="UPLOAD" subtitle="Securely Add Your Data" />
      </Box>
    </Box>
  );
};

export default Upload;
