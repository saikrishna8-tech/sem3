import { Router } from 'express';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { validateCourse } from '../validators/courseValidator.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Admin-only write endpoints
router.post('/', authenticateUser, authorizeRoles('ADMIN'), validateCourse, createCourse);
router.put('/:id', authenticateUser, authorizeRoles('ADMIN'), validateCourse, updateCourse);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), deleteCourse);

export default router;
