import { Router } from 'express';
import { ApiError } from '../lib/apiError.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { Product } from '../models/Product.js';
import { presentProduct } from '../presenters.js';

export const productsRouter = Router();

productsRouter.get('/', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json({ products: products.map(presentProduct) });
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product: presentProduct(product) });
  } catch (error) {
    next(error);
  }
});

productsRouter.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ product: presentProduct(product) });
  } catch (error) {
    next(error);
  }
});

productsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
