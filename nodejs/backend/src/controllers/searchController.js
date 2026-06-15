import asyncHandler from '../utils/asyncHandler.js';
import { executeSearch } from '../services/searchService.js';

/**
 * Search Products, Courses, and Categories
 * GET /search?query=&category=&minPrice=&maxPrice=&difficulty=&sortBy=&sortOrder=&page=&limit=
 */
export const search = asyncHandler(async (req, res) => {
  const query = req.query.query || '';
  const categoryFilter = req.query.category || '';
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
  const difficulty = req.query.difficulty || '';
  const sortBy = req.query.sortBy || '';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const results = await executeSearch({
    query,
    category: categoryFilter,
    minPrice,
    maxPrice,
    difficulty,
    sortBy,
    sortOrder,
    page,
    limit,
    userId: req.user ? req.user._id : null,
  });

  res.status(200).json(results);
});
