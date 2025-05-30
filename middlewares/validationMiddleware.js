const { body, validationResult } = require("express-validator");

// Validation rules for creating a task
const createTaskRules = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty.")
      .isString()
      .withMessage("Title must be a string.")
      .isLength({ min: 1 })
      .withMessage("Title must be at least 1 character long."),
    body("description")
      .optional({ checkFalsy: true }) //treat empty strings, null, undefined as optional
      .isISO8601()
      .withMessage(
        "dueDate must be a valid ISO 8601 date (YYYY-MM-DDTHH:mm:ss.sssZ)."
      )
      .toDate(), //sanitzes to a date object
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean (true or false)."),
  ];
};

// Validation rules for updating a task
const updateTaskRules = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty if provided.")
      .isString()
      .withMessage("Title must be a string.")
      .isLength({ min: 1 })
      .withMessage("Title must be at least 1 character long if provided."),
    body("description")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Description must be a string if provided."),
    body("dueDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("dueDate must be a valid ISO 8601 date if provided.")
      .toDate(),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean if provided."),
    // Ensure at least one field is present for an update.
    // This is a bit trickier with express-validator directly in the chain.
    // Often handled by checking req.body in the controller or a custom validator.
    // For simplicity here, we'll rely on the controller to handle empty updates if needed,
    // or you can add a custom middleware after this chain to check req.body.
    // A simple check:
    (req, res, next) => {
      if (Object.keys(req.body).length === 0 && req.method === "PUT") {
        return res.status(400).json({
          errors: [
            {
              msg: "Update request cannot be empty. At least one field must be provided.",
            },
          ],
        });
      }
      next();
    },
  ];
};

// Middleware to check validaton results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); //No errors, proceed
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg })); //err.param is deprecated, use err.path

  return res.status(400).json({
    error: "Validation Error",
    details: extractedErrors,
  });
};

module.exports = {
  createTaskValidation: [createTaskRules(), validate],
  updateTaskValidation: [updateTaskRules(), validate],
};
