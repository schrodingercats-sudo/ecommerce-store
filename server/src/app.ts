import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { ApiError } from './lib/apiError.js';
import { authRouter } from './routes/auth.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { productsRouter } from './routes/products.routes.js';

export const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use((_req, _res, next) => {
  next(new ApiError(404, 'API route not found'));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = error instanceof ApiError ? error.status : 500;
  const message = error instanceof Error ? error.message : 'Internal server error';
  res.status(status).json({ error: message });
});
