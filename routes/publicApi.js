const express = require("express");
const router = express.Router();
const publicApiController = require("../controllers/publicApiController");
const { protectPublicApi } = require("../middlewares/apiKeyAuthMiddleware");
// Define the public route to get all tasks

// GET /api/public/tasks
router.get("/tasks", protectPublicApi, publicApiController.getAllPublicTasks);

module.exports = router;
