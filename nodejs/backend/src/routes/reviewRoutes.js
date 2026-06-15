import { Router } from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { validateReview, validateReviewUpdate } from '../validators/reviewValidator.js';
import { authenticateUser, authorizeRoles, optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticate, getAllReviews);
router.get('/:id', getReviewById);
router.post('/', authenticateUser, validateReview, createReview);
router.put('/:id', authenticateUser, validateReviewUpdate, updateReview);
router.delete('/:id', authenticateUser, deleteReview);

export default router;
