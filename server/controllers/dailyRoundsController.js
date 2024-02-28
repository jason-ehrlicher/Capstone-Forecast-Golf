"use strict";
const Models = require("../models");

// Retrieve all golf rounds from the database
const getGolfRounds = (req, res) => {
  Models.GolfRounds.findAll({})
    .then((rounds) => {
      res.status(200).json(rounds);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error retrieving golf rounds", error: error.message });
    });
};

// Create a new golf round in the database
const createGolfRounds = (req, res) => {
  const roundData = req.body; // Assuming roundData contains all the required golf round fields
  Models.GolfRounds.create(roundData)
    .then((round) => {
      res.status(201).json(round);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error creating golf round", error: error.message });
    });
};

// Update an existing golf round's information in the database
const updateGolfRounds = (req, res) => {
  const { id } = req.params; // Extracting golf round ID from request parameters
  const updateData = req.body; // Assuming updateData contains the fields to be updated

  Models.GolfRounds.update(updateData, { where: { id } })
    .then((numUpdated) => {
      if (numUpdated[0] === 1) {
        // Fetch the updated golf round and send it back
        Models.GolfRounds.findByPk(id)
          .then((updatedRound) => {
            if (updatedRound) {
              res.status(200).json(updatedRound);
            } else {
              res.status(404).send({ message: "Golf round not found." });
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send({ message: "An error occurred while retrieving updated golf round.", error: error.message });
          });
      } else {
        res.status(404).send({ message: `Cannot update golf round with id=${id}. Maybe golf round was not found or req.body is empty!` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error updating golf round", error: error.message });
    });
};

// Delete a golf round from the database
const deleteGolfRounds = (req, res) => {
  const { id } = req.params; // Extracting golf round ID from request parameters

  Models.GolfRounds.destroy({ where: { id } })
    .then((numDeleted) => {
      if (numDeleted === 1) {
        res.status(200).send({ message: "Golf round was deleted successfully." });
      } else {
        res.status(404).send({ message: `Cannot delete golf round with id=${id}. Maybe golf round was not found.` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error deleting golf round", error: error.message });
    });
};

module.exports = {
  getGolfRounds,
  createGolfRounds,
  updateGolfRounds,
  deleteGolfRounds,
};
