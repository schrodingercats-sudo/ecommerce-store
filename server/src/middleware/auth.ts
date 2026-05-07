import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';
import { ApiError } from '../lib/apiError.js';
import { verifyToken, type TokenUser } from '../lib/tokens.js';

export type AuthedRequest = Request & {
  authUser?: TokenUser;
};

export const requireAuth = async (req: AuthedRequest, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authentication required');

    const payload = verifyToken(token);
    const userId = payload.sub;
    if (!userId || typeof userId !== 'string') throw new ApiError(401, 'Invalid token');

    const user = await User.findById(userId).select('email name role').lean();
    if (!user) throw new ApiError(401, 'User no longer exists');

    req.authUser = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req: AuthedRequest, _res: Response, next: NextFunction) => {
  if (!req.authUser) return next(new ApiError(401, 'Authentication required'));
  if (req.authUser.role !== 'admin') return next(new ApiError(403, 'Admin access required'));
  return next();
};
