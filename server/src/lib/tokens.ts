import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type TokenUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
};

export const signToken = (user: TokenUser) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '7d' });

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
