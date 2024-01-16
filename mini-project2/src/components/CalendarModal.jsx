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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { useTheme, } from "@emotion/react";
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
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <img
          src={logo}
          alt="Forecast Golf Logo"
          style={{ maxWidth: "350px" }}
        />
      </Box>
      <DialogTitle>
        Event Details:
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
          }
          label="All Day Event"
        />
      </DialogContent>
      <DialogActions>
        {isExistingEvent && (
          <Button
          style={{ color: 'red' }}
            onClick={() => onDeleteEvent(selectedEvent)}
          >
            Delete Event
          </Button>
        )}
        <Button onClick={handleSubmit}
        color="secondary"
        >
          {isExistingEvent ? "Update" : "Add"} Event
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CalendarModal;
