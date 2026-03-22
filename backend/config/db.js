const mysql = require("mysql2/promise");

let pool = null;

const connectDB = async () => {
  try {
    if (pool) return pool;

    pool = mysql.createPool({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected (Railway Internal)");
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