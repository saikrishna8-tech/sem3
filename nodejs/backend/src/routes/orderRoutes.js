import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import { validateCreateOrder, validateUpdateOrder } from '../validators/orderValidator.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', validateCreateOrder, createOrder);
router.put('/:id', authorizeRoles('ADMIN'), validateUpdateOrder, updateOrder);
router.delete('/:id', authorizeRoles('ADMIN'), deleteOrder);

export default router;
