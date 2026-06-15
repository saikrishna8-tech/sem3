import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { validateProduct } from '../validators/productValidator.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin-only write endpoints
router.post('/', authenticateUser, authorizeRoles('ADMIN'), validateProduct, createProduct);
router.put('/:id', authenticateUser, authorizeRoles('ADMIN'), validateProduct, updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), deleteProduct);

export default router;
