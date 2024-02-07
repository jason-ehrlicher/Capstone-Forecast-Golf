"use strict";
const Models = require("../models");

// Retrieve all users from the database
const getUsers = (req, res) => {
  Models.User.findAll({})
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: err.message });
    });
};

// Create a new user in the database
const createUser = (req, res) => {
  const userData = req.body; // Assuming userData contains all the required user fields
  Models.User.create(userData)
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: err.message });
    });
};

// Update an existing user's information in the database
const updateUser = (req, res) => {
  const { id } = req.params; // Extracting user ID from request parameters
  const updateData = req.body; // Assuming updateData contains the fields to be updated
  
  Models.User.update(updateData, { where: { id } })
    .then((numUpdated) => {
      if (numUpdated[0] === 1) {
        res.status(200).json({ message: "User updated successfully." });
      } else {
        res.status(404).send({ message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!` });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: err.message });
    });
};

// Delete a user from the database
const deleteUser = (req, res) => {
  const { id } = req.params; // Extracting user ID from request parameters
  
  Models.User.destroy({ where: { id } })
    .then((numDeleted) => {
      if (numDeleted === 1) {
        res.status(200).json({ message: "User was deleted successfully." });
      } else {
        res.status(404).send({ message: `Cannot delete user with id=${id}. Maybe user was not found.` });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
