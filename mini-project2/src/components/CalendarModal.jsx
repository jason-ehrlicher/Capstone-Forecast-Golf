import logo from "/assets/forecast golf banner.png";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
  useTheme,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../theme";

// CalendarModal component definition
function CalendarModal({
  open,
  onClose,
  selectedEvent,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}) {
  // State variables for the event details
  const [eventTitle, setEventTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const isExistingEvent = selectedEvent && selectedEvent.id;

  // Accessing the theme for styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Effect to initialize state when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      setEventTitle(selectedEvent.title || "");
      setAllDay(selectedEvent.allDay || false);
  
      if (selectedEvent.start && selectedEvent.end) {
        // Check if the selected event has start and end times
        const startDateTime = new Date(selectedEvent.start);
        const endDateTime = new Date(selectedEvent.end);
  
        // Adjust the time zone offset
        const timezoneOffset = startDateTime.getTimezoneOffset() * 60000;
        const adjustedStartDateTime = new Date(
          startDateTime.getTime() - timezoneOffset
        );
        const adjustedEndDateTime = new Date(
          endDateTime.getTime() - timezoneOffset
        );
  
        // Format the start and end times in the required format (YYYY-MM-DDTHH:mm)
        const formattedStartTime = adjustedStartDateTime.toISOString().slice(0, 16);
        const formattedEndTime = adjustedEndDateTime.toISOString().slice(0, 16);
  
        setStartTime(formattedStartTime);
        setEndTime(formattedEndTime);
      }
    } else {
      // Set default start and end times to the selected date (if available) or current date
      const currentDate = new Date();
      const selectedDate = selectedEvent ? new Date(selectedEvent.start) : currentDate;
  
      // Set the time to 12:00 PM for the selected date
      selectedDate.setHours(12, 0, 0, 0);
  
      const formattedStartTime = selectedDate.toISOString().slice(0, 16);
      const formattedEndTime = selectedDate.toISOString().slice(0, 16);
  
      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);
      setEventTitle("");
      setAllDay(false);
    }
  }, [selectedEvent]);

  // Function to handle form submission
  const handleSubmit = () => {
    if (eventTitle) {
      const event = {
        ...selectedEvent,
        title: eventTitle,
        allDay,
        start: startTime,
        end: endTime,
      };
      isExistingEvent ? onUpdateEvent(event) : onAddEvent(event);
      onClose();
    }
  };

  // Rendering the modal dialog
  return (
    <Dialog open={open} onClose={onClose}>
      {/* Displaying the logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
          backgroundColor:
            theme.palette.mode === "light" ? "#fcfcfc" : colors.primary[400],
        }}
      >
        <img
          src={logo}
          alt="Forecast Golf Logo"
          style={{ maxWidth: "350px" }}
        />
      </Box>

      {/* Dialog title with close button */}
      <DialogTitle sx={{ backgroundColor: colors.primary[400] }}>
        Event Details:
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: colors.grey[100],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog content for event details */}
      <DialogContent
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#fcfcfc" : colors.primary[500],
        }}
      >
        {/* Text field for event title */}
        <TextField
          fullWidth
          label="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          margin="normal"
          InputLabelProps={{
            style: {
              color:
                theme.palette.mode === "light"
                  ? colors.primary[100]
                  : colors.grey[100],
            },
          }}
          InputProps={{
            style: {
              color:
                theme.palette.mode === "light"
                  ? colors.primary[800]
                  : colors.grey[100],
            },
          }}
          sx={{
            "& label.Mui-focused": {
              color: colors.primary[100],
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.primary[100],
              },
              "&:hover fieldset": {
                borderColor: colors.primary[100],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.primary[100],
              },
            },
          }}
        />

        {/* Grid container for start and end times */}
        <Grid container spacing={2}>
          {/* Start time */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
                style: {
                  color:
                    theme.palette.mode === "light"
                      ? colors.primary[100]
                      : colors.grey[100],
                },
              }}
              InputProps={{
                style: {
                  color:
                    theme.palette.mode === "light"
                      ? colors.primary[800]
                      : colors.grey[100],
                },
              }}
              sx={{
                "& label.Mui-focused": {
                  color: colors.primary[100],
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colors.primary[100],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.primary[100],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.primary[100],
                  },
                },
              }}
              disabled={allDay}
            />
          </Grid>

          {/* End time */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
                style: {
                  color:
                    theme.palette.mode === "light"
                      ? colors.primary[100]
                      : colors.grey[100],
                },
              }}
              InputProps={{
                style: {
                  color:
                    theme.palette.mode === "light"
                      ? colors.primary[800]
                      : colors.grey[100],
                },
              }}
              sx={{
                "& label.Mui-focused": {
                  color: colors.primary[100],
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colors.primary[100],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.primary[100],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.primary[100],
                  },
                },
              }}
              disabled={allDay}
            />
          </Grid>
        </Grid>

        {/* Checkbox for all-day event */}
        <FormControlLabel
          control={
            <Checkbox
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              sx={{
                color: colors.greenAccent[500],
                "&.Mui-checked": {
                  color: colors.blueAccent[500],
                },
                "&:not(.Mui-checked)": {
                  color:
                    theme.palette.mode === "light"
                      ? colors.primary[100]
                      : colors.greenAccent[500],
                },
              }}
            />
          }
          label="All Day Event"
          sx={{
            color:
              theme.palette.mode === "light"
                ? colors.primary[100]
                : colors.grey[100],
          }}
        />
      </DialogContent>

      {/* Dialog actions for submit and delete buttons */}
      <DialogActions
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#fcfcfc" : colors.primary[600],
          color:
            theme.palette.mode === "light"
              ? colors.grey[700]
              : colors.grey[100],
        }}
      >
        {/* Conditionally render delete button for existing events */}
        {isExistingEvent && (
          <Button
            onClick={() => onDeleteEvent(selectedEvent)}
            sx={{ color: colors.redAccent[500] }}
          >
            Delete Event
          </Button>
        )}

        {/* Submit button for adding or updating event */}
        <Button
          onClick={handleSubmit}
          color="secondary"
          sx={{ color: colors.greenAccent[500] }}
        >
          {isExistingEvent ? "Update" : "Add"} Event
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CalendarModal;