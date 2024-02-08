const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");
const bodyParser = require("body-parser");
const { User } = require('../models'); // Adjust the path as necessary


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

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // In a real application, you'd hash the password and compare it securely
      // Here, we're comparing plain text for simplicity, which is not secure
      if (user.password === password) {
        res.json({
          message: "Login successful",
          user: { email: user.email, id: user.id },
        }); // Avoid sending back the password
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while trying to log in" });
    });
});

module.exports = router;
