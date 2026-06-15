import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Get All Products
 * GET /api/products
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

/**
 * Get Product By Id
 * GET /api/products/:id
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, `Product not found with id: ${req.params.id}`);
  }
  res.status(200).json(product);
});

/**
 * Create Product
 * POST /api/products
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, rating, category, imageUrl } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    rating: rating !== undefined ? rating : 4.5,
    category,
    imageUrl
  });

  res.status(201).json(product);
});

/**
 * Update Product
 * PUT /api/products/:id
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, rating, category, imageUrl } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, `Product not found with id: ${req.params.id}`);
  }

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (rating !== undefined) product.rating = rating;
  if (category !== undefined) product.category = category;
  if (imageUrl !== undefined) product.imageUrl = imageUrl;

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});

/**
 * Delete Product
 * DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, `Product not found with id: ${req.params.id}`);
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Product deleted successfully' });
});
