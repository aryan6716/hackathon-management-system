const mysql = require("mysql2/promise");

let pool;

const connectDB = async () => {
  try {
    if (pool) return pool;

    // 🔥 USE PUBLIC URL
    pool = mysql.createPool(process.env.MYSQL_PUBLIC_URL);

    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected (Railway Public)");
    conn.release();

    return pool;

  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error("DB not initialized");
  }
  return pool;
};

module.exports = { connectDB, getPool };