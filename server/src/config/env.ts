import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (key: string, fallback?: string) => {
  const value = process.env[key] || fallback;
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: requireEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/urbancart_ecommerce'),
  jwtSecret: requireEnv('JWT_SECRET', 'replace-this-development-secret'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173',
};
