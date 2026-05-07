import { Router } from 'express';
import { ApiError } from '../lib/apiError.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { signToken } from '../lib/tokens.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { presentUser } from '../presenters.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
    if (!email || !password || !name) throw new ApiError(400, 'Name, email and password are required');
    if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) throw new ApiError(409, 'Email already registered');

    const userCount = await User.countDocuments();
    const user = await User.create({
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: await hashPassword(password),
      role: userCount === 0 ? 'admin' : 'user',
    });

    const safeUser = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.status(201).json({ user: presentUser(safeUser), token: signToken(safeUser) });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) throw new ApiError(400, 'Email and password are required');

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const passwordOk = await verifyPassword(password, user.passwordHash);
    if (!passwordOk) throw new ApiError(401, 'Invalid email or password');

    const safeUser = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.json({ user: presentUser(safeUser), token: signToken(safeUser) });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: presentUser(req.authUser!) });
});

authRouter.post('/logout', requireAuth, (_req, res) => {
  res.json({ ok: true });
});
