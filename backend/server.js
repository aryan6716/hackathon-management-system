const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();

// ======================
// 🔥 CORS CONFIG (FIXED)
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://hackathonhub.vercel.app",
  "https://hackathonhub.up.railway.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("❌ CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 Handle preflight requests
app.options("*", cors());

// ======================
// Middleware
// ======================
app.use(express.json());

// ======================
// Health Check
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
// Error Handler (GLOBAL)
// ======================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ======================
// Start Server AFTER DB
// ======================
const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ DB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();