// server.js
// HackathonHub - Main Express Server Entry Point

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, getPool } = require('./config/db');

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

// ✅ FIXED CORS (IMPORTANT for deployed frontend)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hackathonhub.vercel.app" // apna frontend domain add karo
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
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
app.use('/api/projects', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

// =====================
// Health Check
// =====================
app.get('/api/health', (req, res) => {
  let dbStatus = "disconnected";
  try {
    getPool();
    dbStatus = "connected";
  } catch (err) {
    // DB not initialized
  }

  res.json({
    status: "OK",
    server: "running",
    database: dbStatus
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
  try {
    // 🔥 CONNECT DB FIRST
    await connectDB();
  } catch (error) {
    console.error("❌ Failed to connect to DB on startup:", error.message);
    // Ensure we don't crash, let routes throw "DB not Initialized"
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 HackathonHub API running on port ${PORT}`);
    console.log(`🌍 Live URL: https://hackathonhub.up.railway.app`);
    console.log(`📋 Health: /api/health`);
  });
};

startServer();