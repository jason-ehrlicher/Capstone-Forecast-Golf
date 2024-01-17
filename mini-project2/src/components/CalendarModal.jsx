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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../theme";

function CalendarModal({
  open,
  onClose,
  selectedEvent,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}) {
  const [eventTitle, setEventTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const isExistingEvent = selectedEvent && selectedEvent.id;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (selectedEvent) {
      setEventTitle(selectedEvent.title || "");
      setAllDay(selectedEvent.allDay || false);
      setStartTime(selectedEvent.start || new Date());
      setEndTime(selectedEvent.end || new Date());
    }
  }, [selectedEvent]);

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

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Logo Image */}
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
      <DialogContent
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#fcfcfc" : colors.primary[500],
        }}
      >
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
            // notchedOutline: {
            //   borderColor:
            //     theme.palette.mode === "light"
            //       ? colors.primary[400]
            //       : colors.grey[100],
            // },
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
        {isExistingEvent && (
          <Button
            onClick={() => onDeleteEvent(selectedEvent)}
            sx={{ color: colors.redAccent[500] }}
          >
            Delete Event
          </Button>
        )}
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
