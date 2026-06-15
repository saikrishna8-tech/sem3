import { Router } from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { validateCategory } from '../validators/categoryValidator.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin-only write endpoints
router.post('/', authenticateUser, authorizeRoles('ADMIN'), validateCategory, createCategory);
router.put('/:id', authenticateUser, authorizeRoles('ADMIN'), validateCategory, updateCategory);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), deleteCategory);

export default router;
