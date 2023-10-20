const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/usersModel");

router.post(
  "/users",
  [
    check("name").notEmpty(),
    check("address").notEmpty(),
    check("coordinates").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = new User(req.body);

    try {
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user data" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user data" });
  }
});

router.get("/nearby-users", async (req, res) => {
  const { longitude, latitude } = req.query;

  if (!longitude || !latitude) {
    return res
      .status(400)
      .json({ error: "Longitude and latitude are required." });
  }

  try {
    const nearbyUsers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          maxDistance: 5000,
          spherical: true,
        },
      },
    ]);
    res.json(nearbyUsers);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
