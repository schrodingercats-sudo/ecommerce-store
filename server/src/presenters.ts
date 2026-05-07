import type { OrderDocument } from './models/Order.js';
import type { ProductDocument } from './models/Product.js';
import type { TokenUser } from './lib/tokens.js';

export const presentUser = (user: TokenUser) => user;

export const presentProduct = (product: ProductDocument) => ({
  id: String(product._id),
  name: product.name,
  price: product.price,
  category: product.category,
  brand: product.brand,
  sizes: product.sizes,
  colors: product.colors,
  image: product.image,
  description: product.description,
  stock: product.stock,
  featured: product.featured,
});

export const presentOrder = (order: OrderDocument) => ({
  id: order.code,
  userId: String(order.userId),
  userEmail: order.userEmail,
  items: order.items.map((item) => ({
    productId: String(item.productId),
    size: item.size,
    color: item.color,
    qty: item.qty,
    name: item.name,
    price: item.price,
    image: item.image,
  })),
  total: order.total,
  status: order.status,
  createdAt: order.createdAt.toISOString(),
  shipping: order.shipping,
});
