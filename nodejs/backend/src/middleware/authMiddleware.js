import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../config/jwt.js';
import User from '../models/User.js';

/**
 * Authenticate User Middleware
 * Verifies Bearer token, checks database, and binds user to request context.
 */
export const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization header missing or invalid. Format must be "Bearer <token>".');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new ApiError(401, 'Invalid or expired access token.');
  }

  // Fetch user from db to guarantee validity
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new ApiError(401, 'User associated with this token no longer exists.');
  }

  // Bind user object and role to request
  req.user = user;
  next();
});

/**
 * Authorize Roles Middleware
 * Checks if the authenticated user has one of the allowed roles.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required for this operation.'));
    }

    const hasRole = roles.map(r => r.toUpperCase()).includes(req.user.role.toUpperCase());
    if (!hasRole) {
      return next(new ApiError(403, `Access denied. Role "${req.user.role}" does not have access permission.`));
    }

    next();
  };
};

/**
 * Optional Authenticate Middleware
 * Extracts user if Bearer token is provided, but does not block request if missing or invalid.
 */
export const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (decoded) {
      const user = await User.findOne({ email: decoded.email });
      if (user) {
        req.user = user;
      }
    }
  }
  next();
});

