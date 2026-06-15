import Course from '../models/Course.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Get All Courses
 * GET /api/courses
 */
export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.status(200).json(courses);
});

/**
 * Get Course By Id
 * GET /api/courses/:id
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new ApiError(404, `Course not found with id: ${req.params.id}`);
  }
  res.status(200).json(course);
});

/**
 * Create Course
 * POST /api/courses
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { courseName, description, difficulty, category } = req.body;

  const course = await Course.create({
    courseName,
    description,
    difficulty,
    category
  });

  res.status(201).json(course);
});

/**
 * Update Course
 * PUT /api/courses/:id
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { courseName, description, difficulty, category } = req.body;

  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new ApiError(404, `Course not found with id: ${req.params.id}`);
  }

  if (courseName !== undefined) course.courseName = courseName;
  if (description !== undefined) course.description = description;
  if (difficulty !== undefined) course.difficulty = difficulty;
  if (category !== undefined) course.category = category;

  const updatedCourse = await course.save();
  res.status(200).json(updatedCourse);
});

/**
 * Delete Course
 * DELETE /api/courses/:id
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new ApiError(404, `Course not found with id: ${req.params.id}`);
  }

  await Course.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Course deleted successfully' });
});
