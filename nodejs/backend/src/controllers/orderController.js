import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'ADMIN' ? {} : { user: req.user._id };
  const orders = await Order.find(filter)
    .populate('user', 'name email role')
    .populate('items.product', 'name price imageUrl');
  res.status(200).json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email role')
    .populate('items.product', 'name price imageUrl');

  if (!order) {
    throw new ApiError(404, `Order not found with id: ${req.params.id}`);
  }

  if (req.user.role !== 'ADMIN' && order.user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied. You can only view your own orders.');
  }

  res.status(200).json(order);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item.');
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(400, `Product not found with id: ${item.product}`);
    }

    const quantity = item.quantity || 1;
    const lineTotal = product.price * quantity;
    totalAmount += lineTotal;

    orderItems.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    status: 'PENDING',
  });

  const populated = await Order.findById(order._id)
    .populate('user', 'name email role')
    .populate('items.product', 'name price imageUrl');

  res.status(201).json(populated);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, `Order not found with id: ${req.params.id}`);
  }

  if (status) order.status = status.toUpperCase();
  const updated = await order.save();

  const populated = await Order.findById(updated._id)
    .populate('user', 'name email role')
    .populate('items.product', 'name price imageUrl');

  res.status(200).json(populated);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, `Order not found with id: ${req.params.id}`);
  }

  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Order deleted successfully' });
});
