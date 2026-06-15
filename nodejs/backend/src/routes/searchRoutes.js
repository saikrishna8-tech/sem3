import { Router } from 'express';
import { search } from '../controllers/searchController.js';
import { optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticate, search);

export default router;
