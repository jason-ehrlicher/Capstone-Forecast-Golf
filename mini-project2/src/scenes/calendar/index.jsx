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


const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);

  const createEventId = () => {
    return String(new Date().getTime()); // Example to create a unique ID based on the current timestamp
  };

  const handleDateClick = (selectedInfo) => {
    // Prepare a new event object
    const newEvent = {
      start: selectedInfo.startStr,
      end: selectedInfo.endStr,
      allDay: selectedInfo.allDay,
    };
    setSelectedEvent(newEvent);
    setModalOpen(true);
  };

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

  const handleEventAdd = (event) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      id: createEventId(), // Ensure a unique ID is generated for new events
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
    });
    setCurrentEvents(calendarApi.getEvents());
  };

  const handleEventUpdate = (event) => {
    const calendarApi = calendarRef.current.getApi();
    let eventToUpdate = calendarApi.getEventById(event.id);
    if (eventToUpdate) {
      eventToUpdate.setProp("title", event.title);
      eventToUpdate.setDates(event.start, event.end);
    }
    setCurrentEvents(calendarApi.getEvents());
  };

  const handleEventDelete = (event) => {
    const calendarApi = calendarRef.current.getApi();
    let eventToDelete = calendarApi.getEventById(event.id);
    if (eventToDelete) {
      eventToDelete.remove();
    }
    setCurrentEvents(calendarApi.getEvents());
  };

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Plan and Track Your Schedule" />
      <Box display="flex" justifyContent="space-between">
        {/* Calender Sidebar */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
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
        {/* calendar */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            ref={calendarRef}
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialViw="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvent={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={[
              {
                id: "12315",
                title: "UAE Tournament",
                date: "2024-01-19",
              },
              {
                id: "5123",
                title: "Tuesday Mens League",
                date: "2024-01-23",
              },
              {
                id: "5124",
                title: "Tuesday Mens League",
                date: "2024-01-02",
              },
              {
                id: "5125",
                title: "Tuesday Mens League",
                date: "2024-01-09",
              },
              {
                id: "5126",
                title: "Tuesday Mens League",
                date: "2024-01-16",
              },
              {
                id: "5127",
                title: "Tuesday Mens League",
                date: "2024-01-30",
              },
              {
                id: "5128",
                title: "Tuesday Mens League",
                date: "2024-02-06",
              },
            ]}
          />
        </Box>
      </Box>
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
