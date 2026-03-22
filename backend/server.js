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
// Health Route
// ======================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
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
// Start Server
// ======================
const startServer = async () => {
  try {
    const db = await connectDB();

    if (!db) {
      console.log("⚠️ DB not connected (app will still run)");
    } else {
      console.log("✅ DB ready");
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server start error:", err.message);

    // ❗ DO NOT EXIT
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`⚠️ Server running without DB on port ${PORT}`);
    });
  }
};

startServer();