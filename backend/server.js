const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  connectDB,
  getDbStatus,
  startDbReconnectLoop
} = require("./config/db");

const app = express();

// ======================
// Middleware
// ======================
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ======================
// Health Check
// ======================
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ======================
// DB Check Middleware
// ======================
app.use("/api", (req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);

  if (req.path === "/health") return next();

  const db = getDbStatus();
  if (db.isConnected) return next();

  return res.status(503).json({
    success: false,
    code: "DB_UNAVAILABLE",
    message: "Database is currently unavailable. Please try again shortly."
  });
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
  console.error("❌ Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ======================
// Start Server
// ======================
const startServer = async () => {
  try {
    await connectDB(); // ✅ correct use of await

    startDbReconnectLoop();

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
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