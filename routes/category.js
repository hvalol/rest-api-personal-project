const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { categoryValidation } = require("../middlewares/validationMiddleware");
const { protect } = require("../middlewares/authMiddleware");

// apply the 'protect' middleware to all routes in this file
// router.use(protect);

// but alternatively, I can put protect to all routes

// GET /categories - get all categories
router.get("/", protect, categoryController.getAllCategories);

// POST /categories - create category
router.post(
  "/",
  protect,
  categoryValidation,
  categoryController.createCategory
);

// GET /:id - Get single category
router.get("/:id", protect, categoryController.getCategoryById);

// PUT /:id - Update an existing category
router.put(
  "/:id",
  protect,
  categoryValidation,
  categoryController.updateCategory
);

// DELETE /:id - Delete existing category
router.delete("/:id", protect, categoryController.deleteCategory);

module.exports = router;
