const path = require('path');

// .env.local (git-ignored, for secrets/overrides) wins over the committed .env
require('dotenv').config({
  path: [path.join(__dirname, '../.env.local'), path.join(__dirname, '../.env')],
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');
const ERROR_CODES = require('./constants/errorCodes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/todos', todoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: ERROR_CODES.ROUTE_NOT_FOUND,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start accepting requests only once MongoDB is connected
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Could not connect to MongoDB: ${error.message}`);
    process.exit(1);
  });

module.exports = app;
