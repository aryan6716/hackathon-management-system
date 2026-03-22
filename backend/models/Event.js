// backend/models/Event.js
const { getPool } = require('../config/db');

class Event {
  static async create({ name, description, start_date, end_date, created_by }) {
    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO events (name, description, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', start_date, end_date, created_by]
    );
    return this.findById(result.insertId);
  }

  static async findAll() {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT e.*, u.name AS created_by_name,
        (SELECT COUNT(*) FROM teams t WHERE t.event_id = e.id) AS team_count,
        (SELECT COUNT(*) FROM submissions s WHERE s.event_id = e.id) AS submission_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.start_date DESC
    `);
    return rows;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT e.*, u.name AS created_by_name
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  }

  static async assignJudge(judge_id, event_id) {
    const pool = getPool();
    await pool.execute('INSERT INTO judge_assignments (judge_id, event_id) VALUES (?, ?)', [judge_id, event_id]);
  }

  static async isJudgeAssigned(judge_id, event_id) {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id FROM judge_assignments WHERE judge_id = ? AND event_id = ?',
      [judge_id, event_id]
    );
    return rows.length > 0;
  }

  static async getJudges(event_id) {
    const pool = getPool();
    const [rows] = await pool.execute(`
      SELECT u.id, u.name, u.email, ja.assigned_at
      FROM judge_assignments ja
      JOIN users u ON ja.judge_id = u.id
      WHERE ja.event_id = ?
    `, [event_id]);
    return rows;
  }
}

module.exports = Event;
