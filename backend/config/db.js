// // backend/config/db.js
// // MySQL connection pool — robust startup with auto-DB-create and retry
// require('dotenv').config({ path: __dirname + '/../.env' });
// const mysql = require('mysql2/promise');

// let pool = null;
// let isConnected = false;
// let retryTimeout = null;

// const DB_NAME = process.env.DB_NAME || 'hackathonhub';
// const BASE_CONFIG = {
//   host:               process.env.DB_HOST     || '127.0.0.1',
//   port:               parseInt(process.env.DB_PORT || '3306', 10),
//   user:               process.env.DB_USER     || 'root',
//   password:           process.env.DB_PASSWORD || '',
//   waitForConnections: true,
//   connectionLimit:    10,
//   queueLimit:         0,
//   timezone:           '+00:00',
//   connectTimeout:     10000,
// };

// // ─── Create/re-create the main pool with DB_NAME ─────────────────────────────
// const createMainPool = (host) => {
//   if (pool) { try { pool.end(); } catch (_) {} }
//   pool = mysql.createPool({ ...BASE_CONFIG, host, database: DB_NAME });
// };

// // ─── Ensure the database exists (connect without specifying a DB) ─────────────
// const ensureDatabase = async (host) => {
//   const tmpPool = mysql.createPool({ ...BASE_CONFIG, host, database: undefined });
//   try {
//     const conn = await tmpPool.getConnection();
//     await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
//     conn.release();
//   } finally {
//     await tmpPool.end().catch(() => {});
//   }
// };

// // ─── Test connection, trying multiple hosts ───────────────────────────────────
// const testConnection = async (retryOnFail = true) => {
//   const hosts = [
//     process.env.DB_HOST || '127.0.0.1',
//     process.env.DB_HOST === '127.0.0.1' ? 'localhost' : '127.0.0.1',
//   ];

//   for (const host of hosts) {
//     try {
//       // Step 1: ensure database exists (no DB selected)
//       await ensureDatabase(host);
//       // Step 2: connect with DB selected
//       createMainPool(host);
//       const conn = await pool.getConnection();
//       conn.release();

//       console.log(`✅ MySQL Connected (host: ${host} | db: ${DB_NAME} | user: ${BASE_CONFIG.user})`);
//       isConnected = true;
//       if (retryTimeout) { clearTimeout(retryTimeout); retryTimeout = null; }
//       return true;
//     } catch (err) {
//       console.warn(`⚠️  Attempt via ${host} failed: ${err.message}`);
//     }
//   }

//   // All hosts failed
//   isConnected = false;
//   console.error('❌ Database connection failed. MySQL server is not reachable.');
//   console.error('   ► macOS: sudo launchctl load -w /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist');
//   console.error('   ► OR: System Preferences → MySQL → Start MySQL Server');
//   console.error('   ► Then restart: npm run dev');

//   if (retryOnFail) {
//     console.log('⏳  Retrying in 10 seconds...');
//     retryTimeout = setTimeout(() => testConnection(true), 10000);
//   }
//   return false;
// };

// // ─── Auto-create all tables (run once after successful connection) ─────────────
// const initDatabase = async () => {
//   if (!isConnected || !pool) return;

//   const tables = [
//     `CREATE TABLE IF NOT EXISTS users (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       name         VARCHAR(100) NOT NULL,
//       email        VARCHAR(150) NOT NULL UNIQUE,
//       password     VARCHAR(255) NOT NULL,
//       role         ENUM('admin','participant','judge') NOT NULL DEFAULT 'participant',
//       created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_email (email)
//     )`,
//     `CREATE TABLE IF NOT EXISTS events (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       name         VARCHAR(200) NOT NULL,
//       description  TEXT,
//       start_date   DATETIME NOT NULL,
//       end_date     DATETIME NOT NULL,
//       created_by   INT NOT NULL,
//       created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
//       INDEX idx_start_date (start_date)
//     )`,
//     `CREATE TABLE IF NOT EXISTS teams (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       team_name    VARCHAR(100) NOT NULL UNIQUE,
//       leader_id    INT NOT NULL,
//       event_id     INT DEFAULT NULL,
//       team_code    VARCHAR(10) NOT NULL UNIQUE,
//       created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE,
//       FOREIGN KEY (event_id)  REFERENCES events(id) ON DELETE SET NULL,
//       INDEX idx_team_code (team_code)
//     )`,
//     `CREATE TABLE IF NOT EXISTS team_members (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       team_id      INT NOT NULL,
//       user_id      INT NOT NULL,
//       joined_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (team_id) REFERENCES teams(id)  ON DELETE CASCADE,
//       FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE,
//       UNIQUE KEY unique_team_member (team_id, user_id)
//     )`,
//     `CREATE TABLE IF NOT EXISTS submissions (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       team_id      INT NOT NULL,
//       event_id     INT DEFAULT NULL,
//       title        VARCHAR(200) NOT NULL,
//       description  TEXT NOT NULL,
//       github_link  VARCHAR(500) NOT NULL,
//       demo_link    VARCHAR(500) DEFAULT NULL,
//       tech_stack   VARCHAR(300) DEFAULT NULL,
//       submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (team_id)  REFERENCES teams(id)  ON DELETE CASCADE,
//       FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
//       INDEX idx_team_id (team_id),
//       INDEX idx_event_id (event_id)
//     )`,
//     `CREATE TABLE IF NOT EXISTS scores (
//       id            INT AUTO_INCREMENT PRIMARY KEY,
//       submission_id INT NOT NULL,
//       judge_id      INT NOT NULL,
//       score         DECIMAL(4,1) NOT NULL,
//       feedback      TEXT,
//       scored_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
//       FOREIGN KEY (judge_id)      REFERENCES users(id)       ON DELETE CASCADE,
//       UNIQUE KEY unique_judge_submission (submission_id, judge_id),
//       INDEX idx_submission_id (submission_id)
//     )`,
//     `CREATE TABLE IF NOT EXISTS judge_assignments (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       judge_id     INT NOT NULL,
//       event_id     INT NOT NULL,
//       assigned_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (judge_id)  REFERENCES users(id)  ON DELETE CASCADE,
//       FOREIGN KEY (event_id)  REFERENCES events(id) ON DELETE CASCADE,
//       UNIQUE KEY unique_judge_event (judge_id, event_id)
//     )`,
//   ];

//   try {
//     for (const sql of tables) await pool.execute(sql);

//     // Seed default admin (password = "password")
//     await pool.execute(`
//       INSERT INTO users (name, email, password, role) VALUES
//       ('Admin User', 'admin@hackathonhub.com',
//        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
//       ON DUPLICATE KEY UPDATE id = id
//     `);

//     console.log('✅ Database tables initialized');
//   } catch (err) {
//     console.error('⚠️  Table init error:', err.message);
//   }
// };

// const getPool      = () => pool;
// const getDbStatus  = () => isConnected;

// // Lazy pool proxy so controllers can do: const { pool } = require('../config/db')
// // and it always points to the current pool reference (updated on reconnect)
// const poolProxy = new Proxy({}, {
//   get(_target, prop) {
//     if (!pool) throw new Error('DB pool not initialized — MySQL may not be connected yet');
//     return pool[prop];
//   },
// });

// module.exports = { pool: poolProxy, testConnection, initDatabase, getDbStatus, getPool };

require('dotenv').config();
const mysql = require('mysql2/promise');

let pool = null;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    conn.release();

    console.log("✅ MySQL Connected");

  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
  }
};

const getPool = () => pool;

module.exports = { connectDB, getPool };