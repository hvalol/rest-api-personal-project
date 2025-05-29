// import modules
const db = require("../models"); //import db object from models/index.js
const { Task } = db; //destructure the Task model

// Controller function to get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// Controll function to create new task
exports.createTask = async (req, res) => {
  try {
    // get the values first from the req
    const { title, description, dueDate } = req.body;

    // check if title is not null
    if (!title) {
      console.log("Title is required.");
      return res.status(400).json({ error: "Title is required." });
    }
    // create new task inside database
    const newTask = await Task.create({
      title,
      description,
      dueDate,
    });

    // after successfully creating new task inside database
    // return data
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task", error);
    res
      .status(500)
      .json({ Error: "Failed to create task", details: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    // get id first
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // fetch task by id
    const task = Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error fetching task by ID", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch task", details: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // get id first
    const id = parseInt(req.params.id, 10);
    if (isNan(id)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // check if task exists and store task
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    // get values from req
    const { title, description, completed, dueDate } = req.body;

    // if value exists, update value from task object
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;

    //make sure title not updated to null since title required
    if (title == null || (title != undefined && title.trim() === "")) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    //   then update task
    await task.save();
    //   return updated task data
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    // validation error
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: error.errors.map((e) => e.message),
      });
    }
    return res
      .status(500)
      .json({ error: "Failed to updated Task", detials: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // get id first
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // check if task exist first then get task
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // then delete task
    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting task", error);
    return res
      .status(500)
      .json({ error: "Failed to delete task", details: error.message });
  }
};
