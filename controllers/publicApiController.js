const db = require("../models");
const { Task, Category, User } = db;
const { Op } = require("sequelize");
exports.getAllPublicTasks = async (req, res) => {
  try {
    // better practice, use pagination
    // for now, fetch all tasks and include their categories and user ( email only)

    const { sortBy, order, limit, page } = req.body;

    const queryOptions = {
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
          through: { attributes: [] }, //dont include join tables
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email"], //dont include sensitive info like password
        },
      ],
      //   no 'where' clause because its public and I want everything
    };

    // basic sorting( similar to authenticated endpoint)
    if (sortBy) {
      const allowedSortBy = ["createdAt", "updatedAt", "dueDate", "title"];
      if (allowedSortBy.includes(sortBy)) {
        const sortOrder =
          order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";
        queryOptions.order = [[sortBy, sortOrder]];
      } else {
        queryOptions.order = [["createdAt", "DESC"]]; //default sort: newest first
      }
    } else {
      queryOptions.order = [["createdAt", "DESC"]]; //default sort: newest first
    }

    // Basic pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    queryOptions.limit = limitNum;
    queryOptions.offset = (pageNum - 1) * limitNum;

    const { count, rows: tasks } = await Task.findAndCountAll(queryOptions);

    res.status(200).json({
      totalTasks: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      tasks: tasks,
    });
  } catch (error) {
    console.error("Error fetching all public tasks", error);
    res.status(500).json({ error: "Failed to fetch public tasks" });
  }
};
