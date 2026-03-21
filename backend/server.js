// server.js
// HackathonHub - Main Express Server Entry Point

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, initDatabase, getDbStatus } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const teamRoutes = require('./routes/teamRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// =====================
// Middleware
// =====================

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// =====================
// API Routes
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/projects', submissionRoutes); // Alias for backward compatibility
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: "OK",
    server: "running",
    database: getDbStatus() ? "connected" : "disconnected (mock mode active)"
  });
});

// =====================
// 404 Handler
// =====================
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    data: null,
    message: `Route ${req.originalUrl} not found.`
  });
});

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    data: null,
    message: err.message || 'Internal server error.' 
  });
});

// =====================
// Start Server
// =====================
const startServer = async () => {
  const connected = await testConnection();
  if (connected) {
    await initDatabase();
  }

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 HackathonHub API Server running on http://localhost:${PORT}`);
    console.log(`Server running on http://localhost:8000`); // Explicit required log
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });

  // Handle Port Errors (EADDRINUSE)
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
      console.error(`💡 Suggestion: Kill the existing process running on this port.`);
      console.error(`👉 Run: lsof -i :${PORT} followed by kill -9 <PID>`);
      process.exit(1);
    } else {
      console.error('Server error:', error);
    }
  });
};

startServer();