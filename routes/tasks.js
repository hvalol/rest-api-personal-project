// routes/tasks.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController"); // Adjust path if your controllers folder is elsewhere

// GET /tasks - Get all tasks
router.get("/", taskController.getAllTasks);

// POST /tasks - Create a new task
router.post("/", taskController.createTask);

// GET /:id - Get single task by ID
router.get("/:id", taskController.getTaskById);

// PUT /:id - Update an existing task
router.put("/:id", taskController.updateTask);

// DELETE /:id - Delete an existing task;
router.delete("/:id", taskController.deleteTask);

module.exports = router;
