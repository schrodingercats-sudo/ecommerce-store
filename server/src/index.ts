import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { app } from './app.js';

await connectDatabase();

app.listen(env.port, () => {
  console.log(`API server running on http://127.0.0.1:${env.port}`);
});
