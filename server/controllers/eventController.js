"use strict";
const Models = require("../models");

// Retrieve all events from the database
const getEvents = (req, res) => {
  Models.Event.findAll({})
    .then((events) => {
      res.status(200).json(events);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error retrieving events", error: error.message });
    });
};

// Create a new event in the database
const createEvent = (req, res) => {
  const eventData = req.body; // Assuming eventData contains all the required event fields
  Models.Event.create(eventData)
    .then((event) => {
      res.status(201).json(event);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error creating event", error: error.message });
    });
};

// Update an existing event's information in the database
const updateEvent = (req, res) => {
  const { id } = req.params; // Extracting event ID from request parameters
  const updateData = req.body; // Assuming updateData contains the fields to be updated

  Models.Event.update(updateData, { where: { id } })
    .then((numUpdated) => {
      if (numUpdated[0] === 1) {
        // Fetch the updated event and send it back
        Models.Event.findByPk(id)
          .then((updatedEvent) => {
            if (updatedEvent) {
              res.status(200).json(updatedEvent);
            } else {
              res.status(404).send({ message: "Event not found." });
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send({ message: "An error occurred while retrieving updated event.", error: error.message });
          });
      } else {
        res.status(404).send({ message: `Cannot update event with id=${id}. Maybe event was not found or req.body is empty!` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error updating event", error: error.message });
    });
};

// Delete an event from the database
const deleteEvent = (req, res) => {
  const { id } = req.params; // Extracting event ID from request parameters

  Models.Event.destroy({ where: { id } })
    .then((numDeleted) => {
      if (numDeleted === 1) {
        res.status(200).send({ message: "Event was deleted successfully." });
      } else {
        res.status(404).send({ message: `Cannot delete event with id=${id}. Maybe event was not found.` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error deleting event", error: error.message });
    });
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
