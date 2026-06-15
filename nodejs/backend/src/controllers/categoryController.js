import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Get All Categories
 * GET /api/categories
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});

/**
 * Get Category By Id
 * GET /api/categories/:id
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, `Category not found with id: ${req.params.id}`);
  }
  res.status(200).json(category);
});

/**
 * Create Category
 * POST /api/categories
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;

  const categoryExists = await Category.findOne({ categoryName });
  if (categoryExists) {
    throw new ApiError(400, 'Category already exists');
  }

  const category = await Category.create({ categoryName });
  res.status(201).json(category);
});

/**
 * Update Category
 * PUT /api/categories/:id
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, `Category not found with id: ${req.params.id}`);
  }

  if (categoryName && categoryName !== category.categoryName) {
    const categoryExists = await Category.findOne({ categoryName });
    if (categoryExists) {
      throw new ApiError(400, 'Category name already exists');
    }
    category.categoryName = categoryName;
  }

  const updatedCategory = await category.save();
  res.status(200).json(updatedCategory);
});

/**
 * Delete Category
 * DELETE /api/categories/:id
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, `Category not found with id: ${req.params.id}`);
  }

  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Category deleted successfully' });
});
