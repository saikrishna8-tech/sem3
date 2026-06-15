import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Common middleware to validate request using express-validator rules
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return next(new ApiError(400, 'Validation failed for request payload', errorArray));
  }
  next();
};

export default validateRequest;
