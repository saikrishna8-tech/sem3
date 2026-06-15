import Product from '../models/Product.js';
import Course from '../models/Course.js';
import Category from '../models/Category.js';
import SearchHistory from '../models/SearchHistory.js';

export const executeSearch = async (options) => {
  const {
    query = '',
    category = '',
    minPrice = 0,
    maxPrice = Infinity,
    difficulty = '',
    sortBy = '',
    sortOrder = 1,
    page = 1,
    limit = 20,
    userId = null,
  } = options;

  if (!query.trim() && !category && !difficulty) {
    return { products: [], courses: [], categories: [] };
  }

  const regexQuery = new RegExp(query.trim(), 'i');
  const skip = (page - 1) * limit;

  const productQuery = {};
  if (query.trim()) {
    productQuery.$or = [
      { name: regexQuery },
      { description: regexQuery },
      { category: regexQuery },
    ];
  }
  if (category) productQuery.category = category;
  if (minPrice > 0 || maxPrice < Infinity) {
    productQuery.price = { $gte: minPrice };
    if (maxPrice < Infinity) productQuery.price.$lte = maxPrice;
  }

  const courseQuery = {};
  if (query.trim()) {
    courseQuery.$or = [
      { courseName: regexQuery },
      { description: regexQuery },
      { category: regexQuery },
    ];
  }
  if (category) courseQuery.category = category;
  if (difficulty) courseQuery.difficulty = new RegExp(`^${difficulty}$`, 'i');

  const categoryQuery = {};
  if (query.trim()) categoryQuery.categoryName = regexQuery;

  const productSort = sortBy ? { [sortBy]: sortOrder } : { createdAt: -1 };
  const courseSort =
    sortBy === 'courseName' || sortBy === 'name'
      ? { courseName: sortOrder }
      : { createdAt: -1 };

  const [products, courses, categories] = await Promise.all([
    Product.find(productQuery).sort(productSort).skip(skip).limit(limit),
    Course.find(courseQuery).sort(courseSort).skip(skip).limit(limit),
    Category.find(categoryQuery).limit(limit),
  ]);

  if (query.trim()) {
    SearchHistory.create({
      user: userId,
      query: query.trim(),
      resultsCount: products.length + courses.length + categories.length,
    }).catch((err) => console.error('Search history log error:', err.message));
  }

  return { products, courses, categories };
};
