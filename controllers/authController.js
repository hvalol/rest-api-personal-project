// import
const db = require("../models");
const jwt = require("jsonwebtoken");

const { User } = db;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "This email address is already in use." });
    }

    // Create user (password will be hashed by the model's beforeCreate hook)
    const newUser = await User.create({ email, password });
    // Exclude password from the response
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    return res
      .status(201)
      .json({ message: "User registered successfully!", user: userResponse });
  } catch (error) {
    // Handle sequelize validation errors (e.g., from password length)
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res
        .status(400)
        .json({ error: "Validation Error", details: messages });
    }
    console.error("Registration Error:", error);
    res.status(500).json({ error: "An error occured during registration." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Use a generic error message for security
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Validate password using the instance method created in user model
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // If password is correct, create a JWT
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d", //Token expires in 30 days
    });

    res.status(200).json({
      message: "Logged in successfully!",
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};
