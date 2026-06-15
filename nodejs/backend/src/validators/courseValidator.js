import { body } from 'express-validator';
import validateRequest from './validateRequest.js';

export const validateCourse = [
  body('courseName')
    .trim()
    .notEmpty().withMessage('Course name is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('difficulty')
    .trim()
    .notEmpty().withMessage('Difficulty level is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  validateRequest
];
