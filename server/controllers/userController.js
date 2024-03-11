"use strict";
const Models = require("../models");
const bcrypt = require("bcryptjs");

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

  // Encrypt the password before saving
  bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error encrypting password" });
    }

    // Replace plain text password with hashed password
    userData.password = hashedPassword;

    // Now, create user with encrypted password
    Models.User.create(userData)
      .then((user) => {
        res
          .status(201)
          .json({ user: { ...user.toJSON(), password: undefined } }); // Exclude password from the response
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ error: err.message });
      });
  });
};

// Update an existing user's information in the database
const updateUser = (req, res) => {
  const { id } = req.params; // Extracting user ID from request parameters
  const updateData = req.body; // Assuming updateData contains the fields to be updated

  if (!id) {
    return res.status(400).send({ message: "User ID is undefined." });
  }

  Models.User.update(updateData, { where: { id } })
    .then((numUpdated) => {
      if (numUpdated[0] === 1) {
        // Fetch the updated user and send it back
        Models.User.findByPk(id)
          .then((updatedUser) => {
            if (updatedUser) {
              res.status(200).json({
                message: "User updated successfully.",
                user: {
                  email: updatedUser.email,
                  id: updatedUser.id,
                  firstName: updatedUser.firstName,
                  lastName: updatedUser.lastName,
                  phoneNumber: updatedUser.phoneNumber,
                  profilePicture: updatedUser.profilePicture,
                  textNotifications: updatedUser.textNotifications,
                  pushNotifications: updatedUser.pushNotifications,
                  marketingEmails: updatedUser.marketingEmails,
                },
              });
            } else {
              res.status(404).send({ message: "Updated user not found." });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({
              error: "An error occurred while retrieving updated user.",
            });
          });
      } else {
        res.status(404).send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
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
        res.status(404).send({
          message: `Cannot delete user with id=${id}. Maybe user was not found.`,
        });
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
