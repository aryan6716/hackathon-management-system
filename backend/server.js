const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Health route
// ======================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ======================
// Start server AFTER DB
// ======================
const startServer = async () => {
  try {
    // 🔥 IMPORTANT
    await connectDB();

    console.log("✅ DB Connected, starting server...");

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
    // Server start
    // ======================
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB failed:", err.message);
    process.exit(1);
  }
};

startServer();