import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import logo from "/assets/forecast golf banner.png";
import logo2 from "/assets/forecast golf logo1.png";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignUpModal from "../../components/SignUpModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Copyright component for the footer
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/dashboard">
        Forecast Golf
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

// Main SignInSide component
export default function SignInSide() {
  const navigate = useNavigate();

  // State to manage the visibility of the SignUp modal
  const [openModal, setOpenModal] = useState(false);

  // Handlers to open and close the SignUp modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { login, loginError } = useAuth();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");

    await login(email, password);

    // Navigate to the dashboard if login is successful
    if (!loginError) {
      navigate("/dashboard");
    }
  };

  // Rendering the component
  return (
    <ThemeProvider theme={defaultTheme}>
      {/* Grid layout for the sign-in page */}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        {/* Grid item for the sign-in form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Logo image at the top */}
            <img
              src={logo}
              alt="Forecast Golf Logo"
              style={{ maxWidth: "350px", marginBottom: "20px" }}
            />

            {/* Sign-in title */}
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>

            {/* Sign-in form */}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {loginError && (
                <Typography color="error">{loginError}</Typography>
              )}

              {/* Email input field */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

              {/* Password input field */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              {/* Remember me checkbox */}
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />

              {/* Sign-in button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              {/* Links for forgot password and sign-up */}
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" onClick={handleOpenModal}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  mt: 5,
                }}
              >
                {/* Secondary logo at the bottom */}
                <img
                  src={logo2}
                  alt="Forecast Golf Logo"
                  style={{ maxWidth: "150px" }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                <Link color="inherit" href="/contact">
                  Contact Us
                </Link>
              </Typography>
              {/* Copyright information */}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
        {/* Grid item for background image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(/assets/heroimage.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      {/* SignUpModal */}
      <SignUpModal open={openModal} onClose={handleCloseModal} />
    </ThemeProvider>
  );
}
