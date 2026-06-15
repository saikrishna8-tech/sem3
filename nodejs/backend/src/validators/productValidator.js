import { body } from 'express-validator';
import validateRequest from './validateRequest.js';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom(val => val >= 0).withMessage('Price cannot be negative'),
  body('rating')
    .optional()
    .isNumeric().withMessage('Rating must be a number')
    .custom(val => val >= 0 && val <= 5).withMessage('Rating must be between 0 and 5'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  body('imageUrl')
    .optional({ values: 'falsy' })
    .trim()
    .custom((val) => !val || /^https?:\/\/.+/.test(val))
    .withMessage('Image URL must be a valid URL'),
  validateRequest
];
