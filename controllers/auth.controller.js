const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const { generateToken } = require("../config/JWT_Config");
const crypto = require("crypto");
const sendEmail = require("../utils/sendmail");

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @METHOD POST
 * @access public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new apiError("User already exists", 400));
  }
  const newUser = await User.create({ name, email, password: password });
  const token = generateToken({ id: newUser._id, role: newUser.role });
  res.status(201).json({ data: newUser, token });
});

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @METHOD POST
 * @access public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new apiError("Invalid credentials", 401));
  }
  if (!(await user.comparePassword(password, user.password))) {
    return next(new apiError("Invalid credentials", 401));
  }
  const token = generateToken({ id: user._id, role: user.role });
  res.status(200).json({ data: user, token });
});

/**
 * @desc Forgot password
 * @route POST /api/v1/auth/forgot-password
 * @METHOD POST
 * @access public
 */
const forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new apiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.name},\n We received a request to reset the password on your Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n Mohamed Elkinany`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new apiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

/**
 * @desc verify reset password code
 * @route POST /api/v1/auth/verify-reset-code
 * @METHOD POST
 * @access public
 */
const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const { email, resetCode } = req.body;
  const user = await User.findOne({ email }).select(
    "+passwordResetCode +passwordResetExpires +passwordResetVerified"
  );
  if (!user) {
    return next(new apiError(`There is no user with that email ${email}`, 404));
  }
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  if (user.passwordResetCode !== hashedResetCode) {
    return next(new apiError("Invalid reset code", 400));
  }
  if (user.passwordResetExpires < Date.now()) {
    return next(new apiError("Reset code has expired", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res
    .status(200)
    .json({ status: "Success", message: "Reset code verified successfully" });
});

/**
 * @desc Reset password
 * @route POST /api/v1/auth/reset-password
 * @METHOD POST
 * @access public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email }).select(
    "+passwordResetCode +passwordResetExpires +passwordResetVerified"
  );
  if (!user) {
    return next(new apiError(`There is no user with that email ${email}`, 404));
  }
  if (!user.passwordResetVerified) {
    return next(new apiError("Please verify your reset code first", 400));
  }
  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;

  await user.save();
  res
    .status(200)
    .json({ status: "Success", message: "Password reset successfully" });
});

module.exports = {
  register,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
};
