// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validationMiddleware");

// Route for user registration
// POST /api/auth/register
router.post("/register", registerValidation, authController.register);

// Route for user login
// POST /api/auth/login
router.post("/login", loginValidation, authController.login);

module.exports = router;
