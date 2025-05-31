// import modules
const express = require("express");
const bodyParser = require("body-parser"); //or use express.json() and express.urlencoded()
const cors = require("cors");
require("dotenv").config();

// import routes
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");

// create express app
const app = express();

// define port
const PORT = process.env.PORT || 5000;

// Middleware
// enable cors for all routes for development
app.use(cors());

// parse json bodies (as sent by api clients)
app.use(express.json());

// parse url-encoded bodies ( as sent by html forms)
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Simple Task Manager API!" });
});

// routes
// task route
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
// ----- start server ---------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
