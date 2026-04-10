const mysql = require("mysql2/promise");

let pool;
let isConnected = false;
let lastDbError = null;

const buildDbConfig = () => {
  const config = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    user: process.env.MYSQLUSER || process.env.DB_USER || "root",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || "hackathonhub",
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000,
  };

  // If using Railway, sometimes SSL is required
  if (config.host.includes('rlwy.net')) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
};

const formatDbError = (error) => ({
  message: error.message,
  code: error.code || "UNKNOWN_DB_ERROR",
  errno: error.errno || null,
});

const connectDB = async ({ throwOnError = false } = {}) => {
  try {
    if (pool && isConnected) return pool;

    console.log("🔄 Connecting to MySQL...");

    pool = mysql.createPool(buildDbConfig());

    const conn = await pool.getConnection();
    conn.release();

    isConnected = true;
    lastDbError = null;

    console.log("✅ MySQL Connected");

    return pool;
  } catch (err) {
    isConnected = false;
    lastDbError = formatDbError(err);
    pool = null;

    console.error("❌ DB Connection Failed:", lastDbError);

    if (throwOnError) throw err;
    return null;
  }
};

const getPool = () => {
  if (!pool || !isConnected) {
    const error = new Error("Database unavailable");
    error.code = "DB_UNAVAILABLE";
    error.details = lastDbError;
    throw error;
  }
  return pool;
};

const getDbStatus = () => ({
  isConnected,
  lastDbError,
});

const startDbReconnectLoop = (retryMs = 15000) => {
  setInterval(async () => {
    if (isConnected) return;

    console.log("🔄 Trying to reconnect DB...");
    await connectDB();
  }, retryMs);
};

module.exports = {
  connectDB,
  getPool,
  getDbStatus,
  startDbReconnectLoop,
};