const router = require("express").Router();

// Controllers
const {
  register,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../controllers/auth.controller");
const {
  updateLoggedUser,
  deleteLoggedUser,
  getLoggedUser,
  getAllUsers,
  getUser,
  deleteUser,
} = require("../controllers/user.controller");

// Validators & Middleware
const {
  registerValidator,
  loginValidator,
  updateUserValidator,
  verifyPassResetCodeValidator,
  resetPasswordValidator,
  forgetPasswordValidator,
} = require("../utils/validators/user.validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { protect, allowedTo } = require("../middlewares/auth.middleware");

// Auth routes
router.post("/register", registerValidator, validatorMiddleware, register);
router.post("/login", loginValidator, validatorMiddleware, login);

// Password reset routes
router.post(
  "/forgot-password",
  forgetPasswordValidator,
  validatorMiddleware,
  forgetPassword
);
router.post(
  "/verify-reset-code",
  verifyPassResetCodeValidator,
  validatorMiddleware,
  verifyPassResetCode
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  validatorMiddleware,
  resetPassword
);

// User profile routes
router.get("/my-profile", protect, getLoggedUser);
router.put(
  "/update-me",
  protect,
  updateUserValidator,
  validatorMiddleware,
  updateLoggedUser
);
router.delete("/delete-me", protect, deleteLoggedUser);

// Admin user management routes
router.get("/", protect, allowedTo("admin"), getAllUsers);
router.get("/:id", protect, getUser);
router.delete("/:id", protect, allowedTo("admin"), deleteUser);

module.exports = router;
