const router = require("express").Router();
// Controllers
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
// Validators & Middleware
const {
  createProductValidator,
  updateProductValidator,
} = require("../utils/validators/product.validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { protect, allowedTo } = require("../middlewares/auth.middleware");

// Product routes
router
  .route("/")
  .get(getProducts)
  .post(protect, allowedTo("admin"), createProductValidator, validatorMiddleware, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, allowedTo("admin"), updateProductValidator, validatorMiddleware, updateProduct)
  .delete(protect, allowedTo("admin"), deleteProduct);

module.exports = router;