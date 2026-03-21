const mysql = require('mysql2/promise');

let pool = null;

// Create connection
const connectDB = async () => {
  if (pool) return pool;

  try {
    const dbConfig = {
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
      throw new Error("Missing required database environment variables.");
    }

    pool = mysql.createPool(dbConfig);

    // Test connection immediately
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();

    return pool;
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    throw err;
  }
};

// Safe getter function
const getPool = () => {
  if (!pool) {
    console.error("🚨 DB Pool accessed before initialization!");
    throw new Error("Database pool has not been initialized. Please ensure connectDB is called.");
  }
  return pool;
};

module.exports = {
  connectDB,
  getPool
};