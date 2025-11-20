const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const linksRouter = require('./routes/links');
const redirectRouter = require('./routes/redirect');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const startTime = Date.now();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (must be before redirect route)
app.get('/healthz', async (req, res) => {
  let databaseStatus = 'connected';
  
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    databaseStatus = 'disconnected';
  }

  res.json({
    ok: true,
    version: '1.0',
    timestamp: new Date().toISOString(),
    database: databaseStatus,
    uptime: Math.floor((Date.now() - startTime) / 1000)
  });
});

// API Routes
app.use('/api/links', linksRouter);

// Redirect route (must be last to not interfere with other routes)
app.use('/', redirectRouter);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TinyLink API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
