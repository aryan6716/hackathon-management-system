// backend/models/User.js
const { getPool } = require('../config/db');

class User {
  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create({ name, email, password, role }) {
    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return this.findById(result.insertId);
  }

  static async findAllParticipants() {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE role = "participant"'
    );
    return rows;
  }
}

module.exports = User;
