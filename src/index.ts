import express from 'express';
import { json } from 'express';
import inventoryRoutes from './routes/inventoryRoutes';
import buyRoutes from './routes/buyRoutes';
import restockRoutes from './routes/restockRoutes';
import errorHandler from './middleware/errorHandler';
import os from 'os';

const app = express();
app.use(json());

// TypeScript-style logging middleware with ISO time and clear format
app.use((req, res, next) => {
  const start = Date.now();
  let responseBody: any = undefined;
  const originalJson = res.json;

  res.json = function (body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const logTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}/${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}/${tz}`;

    let level = '[INFO]';
    if (res.statusCode >= 400 && res.statusCode < 600) {
      level = '[ERROR]';
    } else if (res.statusCode < 200 || res.statusCode >= 600) {
      level = '[OTHER]';
    }

    let msg = '';
    if (responseBody && typeof responseBody.message === 'string') {
      msg = ` - "${responseBody.message}"`;
    }
    
    // Example: [2025-07-23/21:15:60/Asia-Yangon] [ERROR] POST /inventory -> 400 (20ms) - "Chocolate name must be unique"
    console.log(`[${logTime}] ${level} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)${msg}`);
  });
  next();
});

app.use('/inventory', inventoryRoutes);
app.use('/buy', buyRoutes);
app.use('/restock', restockRoutes);

// Catch-all 404 handler for unmatched routes/methods (must be after all routes)
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found', status: 404 });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 Vending Machine API Server Started!');
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log('========================================');
}); 
