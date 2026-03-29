const mysql = require("mysql2/promise");

let pool;

const connectDB = async () => {
  try {
    if (pool) return pool;

    pool = mysql.createPool(process.env.DATABASE_URL);

    const conn = await pool.getConnection();

    console.log("✅ MySQL Connected");

    conn.release();

    return pool;
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error("DB not initialized. Call connectDB() first.");
  }
  return pool;
};

module.exports = { connectDB, getPool };