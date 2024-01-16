import * as React from "react";
import { Dialog, DialogTitle, Icon, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SignUp from "./SignUp";
import logo from "/assets/forecast golf banner.png";
import Box from "@mui/material/Box";

function SignUpModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
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
      {/* Logo Image */}
      <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
        <img
          src={logo}
          alt="Forecast Golf Logo"
          style={{ maxWidth: "350px" }}
        />
      </Box>
      <SignUp/>
    </Dialog>
  );
}

export default SignUpModal;
