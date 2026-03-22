const mysql = require('mysql2/promise');

let pool = null;

// ======================
// Create DB Pool
// ======================
const connectDB = async () => {
  if (pool) {
    console.log("⚡ DB Pool already exists");
    return pool;
  }

  try {
    const dbConfig = {
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    // ======================
    // Validate ENV
    // ======================
    const missingVars = [];
    if (!dbConfig.host) missingVars.push("MYSQLHOST / DB_HOST");
    if (!dbConfig.user) missingVars.push("MYSQLUSER / DB_USER");
    if (!dbConfig.database) missingVars.push("MYSQLDATABASE / DB_NAME");

    if (missingVars.length > 0) {
      throw new Error(`Missing DB ENV variables: ${missingVars.join(", ")}`);
    }

    // ======================
    // Create Pool
    // ======================
    pool = mysql.createPool(dbConfig);

    // ======================
    // Test Connection
    // ======================
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();

    return pool;

  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);

    // Important: reset pool if failed
    pool = null;

    throw err;
  }
};

// ======================
// Safe Pool Getter
// ======================
const getPool = () => {
  if (!pool) {
    throw new Error(
      "🚨 DB Pool not initialized. Call connectDB() before using database."
    );
  }
  return pool;
};

// ======================
// Health Check (Optional)
// ======================
const checkDBHealth = async () => {
  try {
    if (!pool) return false;

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    return true;
  } catch (err) {
    console.error("❌ DB Health Check Failed:", err.message);
    return false;
  }
};

module.exports = {
  connectDB,
  getPool,
  checkDBHealth,
};