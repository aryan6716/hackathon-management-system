const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
    });

    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected");
    conn.release();

  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

const getPool = () => pool;

module.exports = { connectDB, getPool };