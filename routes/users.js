const express = require("express");
const { usersCollections } = require("..");
const router = express.Router();
// const { verifyJWT, isAdmin } = require("../middleware");

// Regular user route
router.get("/users", async (req, res) => {
  try {
    const result = await usersCollections.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const user = req.body;
    console.log(user);

    const query = { email: user.email };
    const existingUser = await usersCollections.findOne(query);

    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    user.role = "user"; // Default role is user

    const result = await usersCollections.insertOne(user);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Check if a user has admin role route
router.get("/users/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    const user = await usersCollections.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const userRole = user.role || "user";
    const isAdmin = userRole === "admin";

    res.status(200).send({ email: userEmail, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
