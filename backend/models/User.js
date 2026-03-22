// backend/models/User.js
const { getPool } = require('../config/db');

class User {

  // ======================
  // FIND BY EMAIL
  // ======================
  static async findByEmail(email) {
    const pool = getPool();

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    return rows[0];
  }

  // ======================
  // FIND BY ID
  // ======================
  static async findById(id) {
    const pool = getPool();

    const [rows] = await pool.execute(
      `SELECT id, name, email, role, created_at 
       FROM users WHERE id = ?`,
      [id]
    );

    return rows[0];
  }

  // ======================
  // CREATE USER (FIXED)
  // ======================
  static async create({ name, email, password, role }) {
    const pool = getPool();

    // ✅ safety check
    if (!name || !email || !password) {
      throw new Error("Missing required fields");
    }

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [
        name,
        email,
        password,
        role || 'participant' // ✅ main fix
      ]
    );

    return this.findById(result.insertId);
  }

  // ======================
  // GET ALL PARTICIPANTS
  // ======================
  static async findAllParticipants() {
    const pool = getPool();

    const [rows] = await pool.execute(
      `SELECT id, name, email, created_at 
       FROM users 
       WHERE role = 'participant'`
    );

    return rows;
  }
}

module.exports = User;