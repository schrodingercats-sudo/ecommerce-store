import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import { hashPassword } from './lib/password.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import { seedProducts } from './data/seedProducts.js';

await connectDatabase();

if ((await Product.countDocuments()) === 0) {
  await Product.insertMany(seedProducts);
}

const users = [
  { email: 'admin@urbancart.com', password: 'admin123', name: 'Admin', role: 'admin' as const },
  { email: 'demo@urbancart.com', password: 'demo123', name: 'Alex Morgan', role: 'user' as const },
];

for (const user of users) {
  const exists = await User.findOne({ email: user.email });
  if (exists) continue;

  await User.create({
    email: user.email,
    name: user.name,
    role: user.role,
    passwordHash: await hashPassword(user.password),
  });
}

console.log('MongoDB seed complete');
await mongoose.disconnect();
