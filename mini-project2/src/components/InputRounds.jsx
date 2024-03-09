import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Link } from "react-router-dom";

const InputRounds = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for handling rounds played, selected date, messages for the Snackbar, Snackbar visibility, and update mode
  const [roundsPlayed, setRoundsPlayed] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState({ text: "", severity: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // useEffect to fetch rounds for the selected date
  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:8082/api/dailyRounds/date/${selectedDate}`)
        .then((response) => response.json())
        .then((data) => {
          // Check if `rounds_played` is not undefined to include cases where it's 0
          if (data.hasOwnProperty("rounds_played")) {
            setRoundsPlayed(data.rounds_played.toString());
            setIsUpdate(true);
          } else {
            setRoundsPlayed("");
            setIsUpdate(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setRoundsPlayed("");
          setIsUpdate(false);
        });
    }
  }, [selectedDate]);

  // Function to handle deletion of a record
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (isConfirmed) {
      const url = `http://localhost:8082/api/dailyRounds/date/${selectedDate}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setMessage({
          text: "Rounds successfully deleted!",
          severity: "success",
        });
        setOpenSnackbar(true);
        setRoundsPlayed("");
        setIsUpdate(false);
        setSelectedDate("");
      } catch (error) {
        console.error("Error:", error);
        setMessage({
          text: "Failed to delete rounds. Please try again.",
          severity: "error",
        });
        setOpenSnackbar(true);
      }
    } else {
      console.log("Deletion cancelled by the user.");
    }
  };

  // Function to handle form submission (both add and update operations)
  const handleSubmit = async () => {
    // Display a confirmation dialog before updating
    const action = isUpdate ? "update" : "add";
    const isConfirmed = window.confirm(
      `Are you sure you want to ${action} this entry?`
    );

    // Proceed with the update operation only if the user confirms
    if (isConfirmed) {
      const date = new Date(selectedDate + "T12:00:00Z");
      const data = {
        date: selectedDate,
        day: date.toLocaleDateString("en-US", { weekday: "long" }),
        rounds_played: parseInt(roundsPlayed),
      };

      const endpoint = isUpdate ? `/date/${selectedDate}` : "";
      const url = `http://localhost:8082/api/dailyRounds${endpoint}`;
      const method = isUpdate ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        await response.json();
        fetchAndUpdateRounds(selectedDate); // Fetch and update rounds for the selected date

        setMessage({
          text: isUpdate
            ? "Rounds successfully updated!"
            : "Rounds successfully added!",
          severity: "success",
        });
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error:", error);
        setMessage({
          text: isUpdate
            ? "Failed to update rounds. Please try again."
            : "Failed to add rounds. Please try again.",
          severity: "error",
        });
        setOpenSnackbar(true);
      }
    } else {
      // If the user does not confirm, you can optionally handle it (e.g., log to console or show a message)
      console.log("Update cancelled by the user.");
    }
  };

  // Function to fetch and update rounds for the selected date
  const fetchAndUpdateRounds = (date) => {
    fetch(`http://localhost:8082/api/dailyRounds/date/${date}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.rounds_played) {
          setRoundsPlayed(data.rounds_played.toString());
          setIsUpdate(true);
        } else {
          setRoundsPlayed("");
          setIsUpdate(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setRoundsPlayed("");
        setIsUpdate(false);
      });
  };

  return (
    <>
      <Box
        mt="30px"
        sx={{ backgroundColor: colors.primary[400] }}
        maxHeight={"300px"}
        minHeight={"300px"}
      >
        <Box
          style={{ padding: "15px", color: colors.grey[100] }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
      <Link to="/history" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography
          variant="h4"
          style={{ marginBottom: "10px", textAlign: "center" }}
          sx={{
            "&:hover": {
              color: "#868dfb", 
            },
          }}
        >
          Input Rounds Played
        </Typography>
      </Link>
          <TextField
            label="Rounds"
            variant="outlined"
            value={roundsPlayed}
            onChange={(e) => setRoundsPlayed(e.target.value)}
            fullWidth
            style={{ marginBottom: "20px", maxWidth: "300px" }}
          />
          <TextField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            style={{ marginBottom: "20px", maxWidth: "300px" }}
          />
          <Box
            display="flex"
            justifyContent={isUpdate ? "space-between" : "center"}
            width="100%"
            maxWidth="300px"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{
                backgroundColor: colors.greenAccent[500],
                width: isUpdate ? "auto" : "50%",
              }}
            >
              {isUpdate ? "Update" : "Submit"}
            </Button>
            {isUpdate && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDelete}
                sx={{ color: colors.redAccent[500] }}
                style={{ maxWidth: "100px" }}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InputRounds;
