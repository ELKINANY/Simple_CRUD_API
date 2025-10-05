const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const apiError = require('../utils/apiError');

/**
 * @desc   Logged user data
 * @route   /api/users/getMe
 * @method  GET
 * @access  protected (logged in user)
 */
const getLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new apiError('User not found', 404));
  res.status(200).json({ data: user });
});

/**
 * @desc   Update logged user data
 * @route   /api/users/getMe
 * @method  GET
 * @access  protected (logged in user)
 */
const updateLoggedUser = asyncHandler(async (req, res, next) => {

  if (req.body.password) {
    return next(new apiError('Password can only be updated from change password route', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedUser) return next(new apiError('User not found', 404));

  res.status(200).json({ data: updatedUser });
});

/**
 * @desc   Delete logged user account
 * @route   /api/users/deleteMe
 * @method  DELETE
 * @access  protected (logged in user)
 */
const deleteLoggedUser = asyncHandler(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.user._id);

  if (!deletedUser) return next(new apiError('User not found', 404));

  res.status(200).json({ message: 'Account deleted successfully' });
});


// admin permissions to manage users

/**
 * @desc   Get all users
 * @route   /api/users
 * @method  GET
 * @access  private (admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ results: users.length, data: users });
});

/**
 * @desc   Get specific user by id
 * @route   /api/users/:id
 * @method  GET
 * @access  private (admin)
 */
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new apiError('User not found', 404));
  res.status(200).json({ data: user });
});

/**
 * @desc   Delete specific user by id
 * @route   /api/users/:id
 * @method  DELETE
 * @access  private (admin)
 */

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new apiError('User not found', 404));
  res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
  updateLoggedUser,
  deleteLoggedUser,
  getLoggedUser,
  getAllUsers,
  getUser,
  deleteUser
}