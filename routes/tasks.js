// routes/tasks.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController"); // Adjust path if your controllers folder is elsewhere
const {
  createTaskValidation,
  updateTaskValidation,
} = require("../middlewares/validationMiddleware"); // Adjust path as needed
const { protect } = require("../middlewares/authMiddleware");

// apply the 'protect' middleware to all routes in this file
// router.use(protect);

// but alternatively, I can put protect to all routes

// GET /tasks - Get all tasks
router.get("/", protect, taskController.getAllTasks);

// GET /tasks/deleted - Get all deleted tasks
router.get("/deleted", protect, taskController.getAllDeletedTasks);

// POST /tasks - Create a new task
router.post("/", protect, createTaskValidation, taskController.createTask);

// GET /:id - Get single task by ID
router.get("/:id", protect, taskController.getTaskById);

// PUT /:id - Update an existing task
router.put("/:id", protect, updateTaskValidation, taskController.updateTask);

// DELETE /:id - Delete an existing task;
router.delete("/:id", protect, taskController.deleteTask);

module.exports = router;
