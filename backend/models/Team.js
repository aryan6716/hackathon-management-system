// backend/models/Team.js
const { pool } = require('../config/db');

class Team {
  static async create({ team_name, leader_id, event_id, team_code }) {
    const [result] = await pool.execute(
      'INSERT INTO teams (team_name, leader_id, event_id, team_code) VALUES (?, ?, ?, ?)',
      [team_name, leader_id, event_id || null, team_code]
    );
    return result.insertId;
  }

  static async findByName(team_name) {
    const [rows] = await pool.execute('SELECT id FROM teams WHERE team_name = ?', [team_name]);
    return rows[0];
  }

  static async findByCode(team_code) {
    const [rows] = await pool.execute('SELECT * FROM teams WHERE team_code = ?', [team_code]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT t.*, u.name AS leader_name, e.name AS event_name
      FROM teams t
      LEFT JOIN users u ON t.leader_id = u.id
      LEFT JOIN events e ON t.event_id = e.id
      WHERE t.id = ?
    `, [id]);
    return rows[0];
  }

  static async addMember(team_id, user_id) {
    await pool.execute('INSERT INTO team_members (team_id, user_id) VALUES (?, ?)', [team_id, user_id]);
  }

  static async isMember(team_id, user_id) {
    const [rows] = await pool.execute(
      'SELECT id FROM team_members WHERE team_id = ? AND user_id = ?',
      [team_id, user_id]
    );
    return rows.length > 0;
  }

  static async hasTeamForEvent(user_id, event_id) {
    const [rows] = await pool.execute(`
      SELECT tm.id FROM team_members tm
      JOIN teams t ON tm.team_id = t.id
      WHERE tm.user_id = ? AND t.event_id = ?
    `, [user_id, event_id]);
    return rows.length > 0;
  }

  static async getMembers(team_id) {
    const [rows] = await pool.execute(`
      SELECT u.id, u.name, u.email, tm.joined_at
      FROM team_members tm JOIN users u ON tm.user_id = u.id
      WHERE tm.team_id = ?
    `, [team_id]);
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT t.*, u.name AS leader_name,
        (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) AS member_count,
        e.name AS event_name
      FROM teams t
      LEFT JOIN users u ON t.leader_id = u.id
      LEFT JOIN events e ON t.event_id = e.id
      ORDER BY t.created_at DESC
    `);
    return rows;
  }

  static async findByUser(user_id) {
    const [rows] = await pool.execute(`
      SELECT t.*, u.name AS leader_name, e.name AS event_name
      FROM teams t
      JOIN team_members tm ON tm.team_id = t.id
      LEFT JOIN users u ON t.leader_id = u.id
      LEFT JOIN events e ON t.event_id = e.id
      WHERE tm.user_id = ?
    `, [user_id]);
    return rows[0];
  }
}

module.exports = Team;
