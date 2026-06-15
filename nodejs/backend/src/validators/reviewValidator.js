import { body } from 'express-validator';
import validateRequest from './validateRequest.js';

export const validateReview = [
  body('product')
    .notEmpty().withMessage('Product ID is required'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  validateRequest,
];

export const validateReviewUpdate = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  validateRequest,
];
