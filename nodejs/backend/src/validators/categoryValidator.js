import { body } from 'express-validator';
import validateRequest from './validateRequest.js';

export const validateCategory = [
  body('categoryName')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 50 }).withMessage('Category name cannot exceed 50 characters'),
  validateRequest
];
