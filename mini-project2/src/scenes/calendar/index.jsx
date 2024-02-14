import Header from "../../components/Header";
import { useState, useRef } from "react";
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

  // Ref for accessing the FullCalendar API
  const calendarRef = useRef(null);

  const { user } = useAuth();

  // Function to create a unique event ID
  const createEventId = () => {
    return String(new Date().getTime()); // Create a unique ID based on the current timestamp
  };

  // Function to handle date selection on the calendar
  const handleDateClick = (selectedInfo) => {
    // Creating a new event object and opening the modal
    const newEvent = {
      start: selectedInfo.startStr,
      end: selectedInfo.endStr,
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
      } else {
        console.error("Failed to create event:", data.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  

  // Function to handle updating an existing event
  const handleEventUpdate = async (event) => {
    
    try {
      const response = await fetch(`http://localhost:8082/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          userId: user?.user?.id, // Include if your backend requires it for validation
        }),
      });
      if (response.ok) {
        const calendarApi = calendarRef.current.getApi();
        let eventToUpdate = calendarApi.getEventById(event.id);
        if (eventToUpdate) {
          eventToUpdate.setProp("title", event.title);
          eventToUpdate.setDates(event.start, event.end);
        }
        setCurrentEvents(calendarApi.getEvents());
      } else {
        const data = await response.json();
        console.error("Failed to update event:", data.message);
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
      } else {
        const data = await response.json();
        console.error("Failed to delete event:", data.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Rendering the Calendar component
  return (
    <Box m="20px">
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
            {currentEvents.map((event) => (
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
            // Array of initial events
            // initialEvents={[
            //   {
            //     id: "12315",
            //     title: "UAE Tournament",
            //     date: "2024-01-19",
            //   },
            //   {
            //     id: "5123",
            //     title: "Tuesday Mens League",
            //     date: "2024-01-23",
            //   },
            //   {
            //     id: "5124",
            //     title: "Tuesday Mens League",
            //     date: "2024-01-02",
            //   },
            //   {
            //     id: "5125",
            //     title: "Tuesday Mens League",
            //     date: "2024-01-09",
            //   },
            //   {
            //     id: "5126",
            //     title: "Tuesday Mens League",
            //     date: "2024-01-16",
            //   },
            //   {
            //     id: "5127",
            //     title: "Tuesday Mens League",
            //     date: "2024-01-30",
            //   },
            //   {
            //     id: "5128",
            //     title: "Tuesday Mens League",
            //     date: "2024-02-06",
            //   },
            // ]}
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
