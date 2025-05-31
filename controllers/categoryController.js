const db = require("../models");
const { Category, User } = db; // Include User if you want to associate categories with users

// Create a new category for the authenticated user
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Category name is required." });
    }

    // Optional: Check if category with the same name already exists for this user
    const existingCategory = await Category.findOne({
      where: { name, userId },
    });
    if (existingCategory) {
      return res.status(409).json({
        error: "A Category with this name already exists for this user.",
      });
    }
    const newCategory = await Category.create({ name, userId });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Get all categories for the authenticated user
exports.getAllCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.findAll({
      where: { userId },
      order: [["name", "ASC"]], //Optional: order by name
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error({ error: "Error fetching categories:", error });
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const category = await Category.findOne({
      where: { id: categoryId, userId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category by ID", error);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
};

// Update existing category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { name } = req.body;
    if (!name || name.trim() == "") {
      return res
        .status(400)
        .json({ error: "Category name must not be empty." });
    }

    const category = await Category.findOne({
      where: { id: categoryId, userId },
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found or you do not have permission to edit it",
      });
    }

    // Optional: Check if another category with the new name already exists for this user
    if (name !== category.name) {
      const existingCategory = await Category.findOne({
        where: { name, userId },
      });
      if (existingCategory) {
        return res.status(409).json({
          error: "A category with this name already exists for this user.",
        });
      }
    }
    category.name = name;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const category = await Category.findOne({
      where: { id: categoryId, userId },
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found or you do not have permission to delete it",
      });
    }
    // When a category is deleted, the associations in TaskCategories will be automatically removed
    // due to 'onDelete: 'CASCADE'' in the join table migration.
    // await category.destroy(); this is a hard delete for categories
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
