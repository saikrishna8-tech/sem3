import { body } from 'express-validator';
import validateRequest from './validateRequest.js';
import { ORDER_STATUS_LIST } from '../constants/orderStatus.js';

export const validateCreateOrder = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product')
    .notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validateRequest,
];

export const validateUpdateOrder = [
  body('status')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(ORDER_STATUS_LIST).withMessage(`Status must be one of: ${ORDER_STATUS_LIST.join(', ')}`),
  validateRequest,
];
