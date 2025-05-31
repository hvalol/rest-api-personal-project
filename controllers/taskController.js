// import modules
const db = require("../models"); //import db object from models/index.js
const { Task, Category } = db; //destructure the Task model
const { Op } = require("sequelize");
// Controller function to get all tasks for authenticated user with filtering and sorting
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { completed, sortBy, order } = req.query;

    // start with instantiating options
    const options = {
      where: {
        userId: userId,
      },
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
          through: { attributes: [] }, //Exclude attributes from the join table
        },
      ],
    };

    // step 2 filter for completed status
    if (completed !== undefined) {
      // Ensure 'completed' is a boolean true/false, not just any string
      if (completed === "true" || completed === "false") {
        options.where.completed = completed === "true"; //conditional to convert completed value to boolean
      } else {
        return res.status(400).json({
          error: 'Invalid value for "completed" filter. Use "true" or "false".',
        });
      }
    }

    // step 3 sorting
    if (sortBy) {
      const allowedSortBy = ["createdAt", "updatedAt", "dueDate", "title"];
      if (allowedSortBy.includes(sortBy)) {
        // set order direction, default to 'ASC' (ascending)
        const sortOrder =
          order && order.toUpperCase() == "DESC" ? "DESC" : "ASC";
        options.order = [[sortBy, sortOrder]];
      } else {
        // Default sort order if none is provided
        options.order = [["createdAt", "DESC"]]; // Default to newest tasks first
      }
    }
    const tasks = await Task.findAll(options);
    // To find ALL tasks including the deleted ones
    const allTasksIncludingDeleted = await Task.findAll({
      paranoid: false,
      options,
    });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// Controller function to get all deleted tasks for authenticated user
exports.getAllDeletedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedTasks = await Task.findAll({
      where: {
        userId: userId,
        deletedAt: {
          [Op.ne]: null, // Op.ne means "not equal", so not equal to null
        },
      },
      paranoid: false, // This is crucial to include soft-deleted records in the search
    });

    if (!deletedTasks || deletedTasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No deleted tasks found for this user." });
    }

    return res.status(200).json(deletedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch tasks", details: error.message });
  }
};
// Controller function to create new task
exports.createTask = async (req, res) => {
  try {
    // get the values first from the req
    const { title, description, dueDate, categoryIds } = req.body;

    const userId = req.user.id; // get userId from the authenticated user

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
      userId,
    });

    // If categoryIds are provided, associate them with the new task
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      // Ensure categories belong to the user and exist
      const categories = await Category.findAll({
        where: {
          id: categoryIds, //categoryIds is an array of primary keys
          userId: userId, //Ensure categories belong to the current user
        },
      });

      // Filter out any IDs that didn't match valid categories for the user
      const validCategoryIds = categories.map((cat) => cat.id);
      if (validCategoryIds.length > 0) {
        await newTask.setCategories(validCategoryIds); //Sequelize method to set assocations
      }
    }
    // Fetch the task again to include categories in the response
    const taskWithCategories = await Task.findByPk(newTask.id, {
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"], //Specif attributes to include for categories
          through: { attributes: [] }, //Don't include join table attributes
        },
      ],
    });

    // after successfully creating new task inside database
    // return data
    res.status(201).json(taskWithCategories);
  } catch (error) {
    console.error("Error creating task", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error:
          "One or more provided category IDs are invalid or do not belong to you.",
      });
    }
    res.status(500).json({ error: "Failed to create task" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    // get id first
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // fetch task by task id and user id
    const task = await Task.findOne({
      where: {
        userId: req.user.id, //Ensures task belongs to the authenticated user
        id: taskId,
      },
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
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
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // check if task exists from authenticated user and store task
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    // get values from req
    const { title, description, completed, dueDate, categoryIds } = req.body;

    // if value exists, update value from task object
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;

    // If categoryIds are provided, update the associations
    // If categoryIds is an empty array, it will remove all associations.
    // If categoryIds is null or undefined, associations will not be changed.
    if (categoryIds !== undefined) {
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        const categories = await Category.findAll({
          where: {
            id: categoryIds,
            userId: req.user.id,
          },
        });
        const validCategoryIds = categories.map((cat) => cat.id);
        await task.setCategories(validCategoryIds); // Replaces all existing categories with the new set
      } else if (Array.isArray(categoryIds) && categoryIds.length === 0) {
        await task.setCategories([]); //Remove all categories
      }
      // If categoryIds is not an array, you might want to return an error or ignore.
    }

    //make sure title not updated to null since title required
    if (title == null || (title != undefined && title.trim() === "")) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    //   then update task
    await task.save();
    //   return updated task data
    // Fetch the updated task with its categories
    const updatedTaskWithCategories = await Task.findByPk(task.id, {
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json(updatedTaskWithCategories);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error:
          "One or more provided category IDs are invalid or do not belong to you.",
      });
    }
    res.status(500).json({ error: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // get id first
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // check if task exist from the authenticated user first then get task
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // then soft delete task(data is still stored but wont be shown and deletedAt will be updated)
    await task.destroy();
    // To permanently delete
    // await task.destroy({ force: true });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting task", error);
    return res
      .status(500)
      .json({ error: "Failed to delete task", details: error.message });
  }
};

exports.restoreTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    const deletedTask = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id,
      },
      paranoid: false, //important: search among the deleted tasks
    });

    // then restore
    if (deletedTask) {
      await deletedTask.restore();
    }
  } catch (error) {
    console.error("error restoring task", error);
    return res
      .status(500)
      .json({ error: "Failed to restore task", details: error.message });
  }
};
