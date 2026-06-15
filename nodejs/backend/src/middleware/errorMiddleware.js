import ApiError from '../utils/ApiError.js';

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Something went wrong on the server';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Handle Mongoose cast error (invalid Object ID)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid field: ${err.path}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const duplicateKey = Object.keys(err.keyValue)[0];
    const message = `Duplicate value error: ${duplicateKey} already exists.`;
    error = new ApiError(400, message);
  }

  // Handle JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid Authentication Token. Access Denied.';
    error = new ApiError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Authentication Token Expired. Please login again.';
    error = new ApiError(401, message);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};
