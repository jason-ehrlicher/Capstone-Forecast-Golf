import Header from "../../components/Header";
import { useState, useRef, useEffect } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { tokens } from "../../theme";
import CalendarModal from "../../components/CalendarModal";
import { useAuth } from "../../context/AuthContext";

// Calendar component definition
const Calendar = () => {
  // Using Material-UI theme and custom tokens for styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for managing current events, modal visibility, and selected event
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    severity: "",
  });

  // Ref for accessing the FullCalendar API
  const calendarRef = useRef(null);

  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  // Function to create a unique event ID
  // const createEventId = () => {
  //   return String(new Date().getTime()); // Create a unique ID based on the current timestamp
  // };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/events");
      const data = await response.json();
      if (response.ok) {
        // Transform the data as needed to match FullCalendar's event object shape
        const transformedEvents = data.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          // Add other properties as needed
        }));
        setEvents(transformedEvents);
      } else {
        console.error("Failed to fetch events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to handle date selection on the calendar
  const handleDateClick = (selectedInfo) => {
    // Creating a new event object and opening the modal
    const newEvent = {
      title: "", // Add a default empty title
      start: new Date(selectedInfo.start),
      end: new Date(selectedInfo.end),
      allDay: selectedInfo.allDay,
    };
    setSelectedEvent(newEvent);
    setModalOpen(true);
  };

  // Function to handle existing event clicks
  const handleEventClick = (clickInfo) => {
    // Set the selected event and open the modal
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
    });
    setModalOpen(true);
  };

  // Function to handle adding a new event
  const handleEventAdd = async (event) => {
    const eventWithUser = {
      ...event,
      userId: user?.user?.id,
    };

    try {
      const response = await fetch("http://localhost:8082/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventWithUser),
      });
      const data = await response.json();
      if (response.ok) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.addEvent({
          id: data.id, // Use the id from the response
          ...event,
        });
        setCurrentEvents(calendarApi.getEvents());
        setSnackbarMessage({
          text: "Event created successfully!",
          severity: "success",
        });
        setOpenSnackbar(true);
      } else {
        console.error("Failed to create event:", data.message);
        setSnackbarMessage({
          text: "Failed to create event. Please try again.",
          severity: "error",
        });
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Function to handle updating an existing event
  const handleEventUpdate = async (event) => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/events/${event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...event,
            userId: user?.user?.id,
          }),
        }
      );
      if (response.ok) {
        const calendarApi = calendarRef.current.getApi();
        let eventToUpdate = calendarApi.getEventById(event.id);
        if (eventToUpdate) {
          eventToUpdate.setProp("title", event.title);
          eventToUpdate.setDates(event.start, event.end);
        }
        setCurrentEvents(calendarApi.getEvents());
        setSnackbarMessage({
          text: "Event updated successfully!",
          severity: "success",
        });
        setOpenSnackbar(true);
        // Removed the call to onClose()
      } else {
        const data = await response.json();
        console.error("Failed to update event:", data.message);
        setSnackbarMessage({
          text: "Failed to update event. Please try again.",
          severity: "error",
        });
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Function to handle deleting an event
  const handleEventDelete = async (event) => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/events/${event.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Remove the event from the calendar
        const calendarApi = calendarRef.current.getApi();
        let eventToDelete = calendarApi.getEventById(event.id);
        if (eventToDelete) {
          eventToDelete.remove();
        }
        setCurrentEvents(calendarApi.getEvents());
        setModalOpen(false);
        setSnackbarMessage({
          text: "Event deleted successfully!",
          severity: "success",
        });
        setOpenSnackbar(true);
      } else {
        const data = await response.json();
        console.error("Failed to delete event:", data.message);
        setSnackbarMessage({
          text: "Failed to delete event. Please try again.",
          severity: "error",
        });
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Function to handle event drag and drop
  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.start ? event.start.toISOString() : undefined,
      end: event.end ? event.end.toISOString() : undefined,
      allDay: eventDropInfo.view.type === "dayGridMonth",
      userId: user?.user?.id,
    };

    if (updatedEvent.start) {
      try {
        const response = await fetch(
          `http://localhost:8082/api/events/${updatedEvent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEvent),
          }
        );
        if (response.ok) {
          // Update the event in the calendar
          const calendarApi = calendarRef.current.getApi();
          const eventToUpdate = calendarApi.getEventById(event.id);
          if (eventToUpdate) {
            eventToUpdate.setDates(event.start, event.end, {
              allDay: updatedEvent.allDay,
            });
            eventToUpdate.setAllDay(updatedEvent.allDay);
          }
          setSnackbarMessage({
            text: "Event updated successfully!",
            severity: "success",
          });
          setOpenSnackbar(true);
        } else {
          throw new Error("Failed to update event");
        }
      } catch (error) {
        console.error("Error updating event:", error);
        setSnackbarMessage({
          text: "Failed to update event. Please try again.",
          severity: "error",
        });
        setOpenSnackbar(true);
      }
    }
  };

  // Function to handle event resize
  const handleEventResize = async (eventResizeInfo) => {
    const { event } = eventResizeInfo;
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      allDay: event.allDay,
      userId: user?.user?.id,
    };

    try {
      const response = await fetch(
        `http://localhost:8082/api/events/${updatedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        }
      );
      if (response.ok) {
        setSnackbarMessage({
          text: "Event updated successfully!",
          severity: "success",
        });
        setOpenSnackbar(true);
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setSnackbarMessage({
        text: "Failed to update event. Please try again.",
        severity: "error",
      });
      setOpenSnackbar(true);
    }
  };

  // Rendering the Calendar component
  return (
    <Box m="20px">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarMessage.severity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage.text}
        </Alert>
      </Snackbar>
      {/* Header component with title and subtitle */}
      <Header title="CALENDAR" subtitle="Plan and Track Your Schedule" />

      {/* Layout for Calendar and Sidebar */}
      <Box display="flex" justifyContent="space-between">
        {/* Sidebar for displaying current events */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          {/* Title for the events list */}
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents
              .slice() // Create a shallow copy of the array
              .sort((a, b) => a.start.getTime() - b.start.getTime()) // Sort the events chronologically
              .map((event) => (
                <ListItem
                  key={event.id} // Unique key for each event
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  {/* Event title and date */}
                  <ListItemText
                    primary={event.title} // Event title
                    secondary={
                      <Typography>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Main calendar view */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            ref={calendarRef} // Reference to access FullCalendar API
            height="75vh"
            // Plugins for different calendar views and interactions
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            // Configuration of the calendar header
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            // Calendar configuration
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            events={events}
          />
        </Box>
      </Box>

      {/* Modal for adding, updating, and deleting events */}
      <CalendarModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedEvent={selectedEvent}
        onAddEvent={handleEventAdd}
        onUpdateEvent={handleEventUpdate}
        onDeleteEvent={handleEventDelete}
      />
    </Box>
  );
};

export default Calendar;
