import * as React from "react";
import { Dialog, DialogTitle, Icon, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SignUp from "./SignUp";
import logo from "/assets/forecast golf banner.png";
import Box from "@mui/material/Box";

// SignUpModal component definition
function SignUpModal({ open, onClose }) {

   // Rendering the sign-up modal dialog
  return (
    <Dialog open={open} onClose={onClose}>

      {/* Dialog title with a close button */}
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

       {/* Box for displaying the logo */}
      <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
        <img
          src={logo}
          alt="Forecast Golf Logo"
          style={{ maxWidth: "350px" }}
        />
      </Box>
      
       {/* Embedding the SignUp component */}
      <SignUp/>
    </Dialog>
  );
}

export default SignUpModal;
