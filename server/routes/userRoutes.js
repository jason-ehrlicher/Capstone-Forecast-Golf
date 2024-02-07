const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

// GET all users
// Example endpoint: http://localhost:8081/api/users
router.get("/", (req, res) => {
  Controllers.userController.getUsers(req, res);
});

// Post create new user
// Example endpoint: http://localhost:8081/api/users/create
router.post("/create", (req, res) => {
  Controllers.userController.createUser(req, res);
});

// PUT update user by id
// Example endpoint: http://localhost:8081/api/users/<id>
router.put("/:id", (req, res) => {
  Controllers.userController.updateUser(req, res);
});

// DELETE user by id
// Example endpoint: http://localhost:8081/api/users/<id>
router.delete("/:id", (req, res) => {
  Controllers.userController.deleteUser(req, res);
});

module.exports = router;
