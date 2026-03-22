const mysql = require('mysql2/promise');

let pool = null;

// ======================
// Connect DB (Singleton)
// ======================
const connectDB = async () => {
  if (pool) {
    console.log("⚡ DB already connected");
    return pool;
  }

  try {
    const dbConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    // ✅ Validate ENV
    const missing = [];
    if (!dbConfig.host) missing.push("DB_HOST");
    if (!dbConfig.user) missing.push("DB_USER");
    if (!dbConfig.database) missing.push("DB_NAME");

    if (missing.length) {
      throw new Error(`Missing ENV: ${missing.join(", ")}`);
    }

    // ✅ Create pool
    pool = mysql.createPool(dbConfig);

    // ✅ Test connection
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    conn.release();

    return pool;

  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);

    // ❗ DO NOT CRASH
    pool = null;

    return null;
  }
};

// ======================
// Get Pool Safely
// ======================
const getPool = () => {
  if (!pool) {
    throw new Error("🚨 DB not initialized");
  }
  return pool;
};

// ======================
// Health Check
// ======================
const checkDBHealth = async () => {
  try {
    if (!pool) return false;

    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    return true;
  } catch {
    return false;
  }
};

module.exports = {
  connectDB,
  getPool,
  checkDBHealth,
};