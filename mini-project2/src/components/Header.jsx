import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

// Header component definition
const Header = ({ title, subtitle }) => {

  // Accessing the theme for styling
  const theme = useTheme();

  // Extracting color tokens based on the current theme mode
  const colors = tokens(theme.palette.mode);

  // Rendering the header component
  return (

    // Box component used as a container for the header
    <Box mb="30px">

       {/* Typography for the main title */}
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}  {/* Displaying the title prop */}
      </Typography>

       {/* Typography for the subtitle */}
      <Typography variant="h5" color={colors.greenAccent[400]}>
       
        {subtitle} {/* Displaying the subtitle prop */}
      </Typography>
    </Box>
  );
};

export default Header;
