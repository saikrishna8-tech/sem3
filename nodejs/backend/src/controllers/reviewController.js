import Review from '../models/Review.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.product) filter.product = req.query.product;
  if (req.query.user) filter.user = req.query.user;

  const reviews = await Review.find(filter)
    .populate('user', 'name email')
    .populate('product', 'name imageUrl');
  res.status(200).json(reviews);
});

export const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name email')
    .populate('product', 'name imageUrl');

  if (!review) {
    throw new ApiError(404, `Review not found with id: ${req.params.id}`);
  }
  res.status(200).json(review);
});

export const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment } = req.body;

  const productExists = await Product.findById(product);
  if (!productExists) {
    throw new ApiError(400, `Product not found with id: ${product}`);
  }

  const existing = await Review.findOne({ user: req.user._id, product });
  if (existing) {
    throw new ApiError(400, 'You have already reviewed this product.');
  }

  const review = await Review.create({
    user: req.user._id,
    product,
    rating,
    comment,
  });

  const populated = await Review.findById(review._id)
    .populate('user', 'name email')
    .populate('product', 'name imageUrl');

  res.status(201).json(populated);
});

export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, `Review not found with id: ${req.params.id}`);
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied. You can only update your own reviews.');
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  const updated = await review.save();
  const populated = await Review.findById(updated._id)
    .populate('user', 'name email')
    .populate('product', 'name imageUrl');

  res.status(200).json(populated);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(404, `Review not found with id: ${req.params.id}`);
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied. You can only delete your own reviews.');
  }

  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Review deleted successfully' });
});
