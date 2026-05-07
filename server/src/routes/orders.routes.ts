import { Router } from 'express';
import { ApiError } from '../lib/apiError.js';
import { requireAdmin, requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { presentOrder } from '../presenters.js';

type IncomingCartItem = {
  productId: string;
  size: string;
  color: string;
  qty: number;
};

const createOrderCode = () => `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

const getOrderTotal = (items: { price: number; qty: number }[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 150 ? 0 : 12;
  const tax = +(subtotal * 0.08).toFixed(2);
  return +(subtotal + shipping + tax).toFixed(2);
};

export const ordersRouter = Router();

ordersRouter.get('/', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const filter = req.authUser!.role === 'admin' ? {} : { userId: req.authUser!.id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ orders: orders.map(presentOrder) });
  } catch (error) {
    next(error);
  }
});

ordersRouter.post('/', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const { items, shipping } = req.body as { items?: IncomingCartItem[]; shipping?: Record<string, string> };
    if (!items?.length) throw new ApiError(400, 'Order must include at least one item');
    if (!shipping?.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.country) {
      throw new ApiError(400, 'Complete shipping details are required');
    }

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new ApiError(404, 'Product not found');
        if (item.qty < 1) throw new ApiError(400, 'Quantity must be at least 1');
        if (product.stock < item.qty) throw new ApiError(400, `${product.name} does not have enough stock`);

        product.stock -= item.qty;
        await product.save();

        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: item.size,
          color: item.color,
          qty: item.qty,
        };
      }),
    );

    const order = await Order.create({
      code: createOrderCode(),
      userId: req.authUser!.id,
      userEmail: req.authUser!.email,
      items: orderItems,
      total: getOrderTotal(orderItems),
      status: 'Pending',
      shipping,
    });

    res.status(201).json({ order: presentOrder(order) });
  } catch (error) {
    next(error);
  }
});

ordersRouter.patch('/:code/status', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body as { status?: string };
    const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !allowed.includes(status)) throw new ApiError(400, 'Invalid order status');

    const order = await Order.findOneAndUpdate(
      { code: req.params.code },
      { status },
      { new: true, runValidators: true },
    );

    if (!order) throw new ApiError(404, 'Order not found');
    res.json({ order: presentOrder(order) });
  } catch (error) {
    next(error);
  }
});
