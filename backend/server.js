const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: __dirname + "/.env" });

const { connectMongo } = require("./config/mongo");

const app = express();

// ======================
// Middleware
// ======================
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." }
});

app.use("/api/", apiLimiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ======================
// Health Check
// ======================
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ======================
// API Logging Middleware
// ======================
app.use("/api", (req, res, next) => {
  console.log(`[API Hit] ${req.method} ${req.originalUrl}`);
  if (req.path === "/health") return next();
  return next();
});

// ======================
// Routes
// ======================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  // Catch Mongoose Schema validation errors correctly
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || 'Validation Error',
      errors: messages
    });
  }

  // Catch Mongoose invalid ObjectIDs
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID'
    });
  }

  console.error("❌ Unhandled Runtime Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : (err.message || "Internal Server Error")
  });
});

// ======================
// Start Server
// ======================
const startServer = async () => {
  const PORT = process.env.PORT || 8000;

  // 1. ALWAYS START SERVER
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  });

  // 2. ATTEMPT MONGO CONNECTION AFTER SERVER STARTS
  // Server will NOT crash if this fails
  try {
    await connectMongo(); 
  } catch (err) {
    console.error("❌ Mongo startup failed implicitly:", err.message);
  }
};

// ======================
// Handle Unhandled Errors
// ======================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
});

// ======================
// Start App
// ======================
startServer();