// import
const jwt = require("jsonwebtoken");
const db = require("../models");
const { User } = db;

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's payload (excluding the password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};

module.exports = { protect };
