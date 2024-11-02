const express = require("express");
const { usersCollections } = require("..");
const { verifyJWT, isAdmin } = require("../middleware/auth"); // Import middleware
const router = express.Router();

// Protected route: Get all users (Admin access required)
router.get("/users", verifyJWT, isAdmin, async (req, res) => {
  try {
    const result = await usersCollections.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Protected route: Get a specific user by ID
router.get("/user/:id", verifyJWT, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await usersCollections.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected route: Update user information
router.put("/user/:id", verifyJWT, async (req, res) => {
  const { name, email } = req.body;
  try {
    const userId = req.params.id;
    const updatedUser = await usersCollections.findOneAndUpdate(
      { _id: userId },
      { $set: { name, email } },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser.value);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-only route: Update user role
router.put("/user/:id/role", verifyJWT, isAdmin, async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;
  try {
    const user = await usersCollections.findOneAndUpdate(
      { _id: userId },
      { $set: { role } },
      { returnOriginal: false }
    );

    if (!user.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.value);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if a user has admin role
router.get("/users/:email", verifyJWT, async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await usersCollections.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const isAdmin = user.role === "admin";
    res.status(200).send({ email: userEmail, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
