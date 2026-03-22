// server.js
// HackathonHub - Main Express Server Entry Point

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, getPool, checkDBHealth } = require('./config/db');

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

// ✅ Dynamic CORS (production safe)
const allowedOrigins = [
  "http://localhost:5173",
  "https://hackathonhub.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.up.railway.app')) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Rejected Origin: ${origin}`);
      callback(new Error("CORS blocked for this origin: " + origin));
    }
  },
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
app.get('/api/health', async (req, res) => {
  let dbStatus = "disconnected";

  try {
    const isHealthy = await checkDBHealth();
    dbStatus = isHealthy ? "connected" : "unhealthy";
  } catch (err) {
    dbStatus = "disconnected";
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
  console.error("🔥 Unhandled Error:", err);

  res.status(err.status || 500).json({
    success: false,
    data: null,
    message: err.message || "Internal server error"
  });
});

// =====================
// Graceful Shutdown
// =====================
process.on('SIGINT', async () => {
  console.log("\n🛑 Server shutting down...");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log("\n🛑 Server terminated...");
  process.exit(0);
});

// =====================
// Start Server
// =====================
const startServer = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await connectDB();
    console.log("✅ Database ready");
  } catch (error) {
    console.error("❌ DB connection failed on startup:", error.message);
    console.log("⚠️ Server will start without DB (limited functionality)");
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 HackathonHub API running on port ${PORT}`);
    console.log(`🌍 Live URL: https://hackathonhub.up.railway.app`);
    console.log(`📋 Health Check: /api/health`);
  });
};

startServer();