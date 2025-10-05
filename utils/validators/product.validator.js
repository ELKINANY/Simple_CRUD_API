const {body, check} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({min: 3, max: 100})
    .withMessage("Name must be between 3 and 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({min: 20})
    .withMessage("Description must be at least 20 characters long"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  validatorMiddleware,
];

const updateProductValidator = [
  check("id").optional().isMongoId().withMessage("Invalid product ID"),
  body("name")
    .optional()
    .isLength({min: 3, max: 100})
    .withMessage("Name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({min: 20})
    .withMessage("Description must be at least 20 characters long"),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number"),
  validatorMiddleware,
];

module.exports = {
  createProductValidator,
  updateProductValidator,
};