import { Router } from 'express';
import { testAuth, register, login, logout, refreshToken, getProfile } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/test', testAuth);
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);
router.post('/refresh-token', authLimiter, refreshToken);
router.get('/profile', authenticateUser, getProfile);

export default router;
