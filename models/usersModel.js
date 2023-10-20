const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  address: String,
  coordinates: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },
});

module.exports = mongoose.model("User", userSchema);
