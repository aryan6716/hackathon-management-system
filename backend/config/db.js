const mysql = require("mysql2/promise");

let pool;

const connectDB = async () => {
  try {
    if (pool) return pool;

    console.log("🔍 ENV CHECK:");
    console.log("HOST:", process.env.DB_HOST);
    console.log("USER:", process.env.DB_USER);
    console.log("DB:", process.env.DB_NAME);

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,

      waitForConnections: true,
      connectionLimit: 10,
    });

    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected");
    conn.release();

    return pool;

  } catch (err) {
    console.error("❌ DB Connection Failed FULL:", err);
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