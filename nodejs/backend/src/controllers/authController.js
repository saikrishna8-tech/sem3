import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/jwt.js';

/**
 * Auth Health Check
 * GET /auth/test
 */
export const testAuth = asyncHandler(async (req, res) => {
  res.status(200).send('Auth Working');
});

/**
 * Register User
 * POST /auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'Email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'USER',
  });

  res.status(200).json(user);
});

/**
 * Login User
 * POST /auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Invalid password');
  }

  const token = generateAccessToken(user.email, user.role);
  const refreshToken = generateRefreshToken(user.email, user.role);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userJson = user.toJSON();

  // Flat fields for frontend AuthContext compatibility + nested user for API contract
  res.status(200).json({
    token,
    user: userJson,
    id: userJson.id,
    name: userJson.name,
    email: userJson.email,
    role: userJson.role,
  });
});

/**
 * Refresh Access Token
 * POST /auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Refresh Token is required.');
  }

  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    throw new ApiError(401, 'Invalid or expired Refresh Token.');
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new ApiError(401, 'User associated with token does not exist.');
  }

  const newAccessToken = generateAccessToken(user.email, user.role);
  const newRefreshToken = generateRefreshToken(user.email, user.role);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    token: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

/**
 * Logout User
 * POST /auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Successfully logged out.' });
});

/**
 * Get User Profile
 * GET /auth/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});
