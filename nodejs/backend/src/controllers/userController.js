import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Get All Users
 * GET /api/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

/**
 * Get User By Id
 * GET /api/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, `User not found with id: ${req.params.id}`);
  }
  res.status(200).json(user);
});

/**
 * Create User (Admin only)
 * POST /api/users
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new ApiError(400, 'Email already in use.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'USER'
  });

  res.status(201).json(user);
});

/**
 * Update User
 * PUT /api/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, `User not found with id: ${req.params.id}`);
  }

  // Check email collision if email is updated
  if (email && email.toLowerCase() !== user.email.toLowerCase()) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, 'Email already in use.');
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (role) user.role = role;
  if (password) user.password = password; // Trigger save pre-hook to hash password

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

/**
 * Delete User
 * DELETE /api/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, `User not found with id: ${req.params.id}`);
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted successfully' });
});
