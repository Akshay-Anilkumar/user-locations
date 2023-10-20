const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

const PORT = 3000;

app.use("/api", require("./routes/usersRoute"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
