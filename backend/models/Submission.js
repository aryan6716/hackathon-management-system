// backend/models/Submission.js

const { getPool } = require('../config/db');

class Submission {

  // ======================
  // Create submission
  // ======================
  static async submit({ team_id, event_id, title, description, github_link }) {
    try {
      const [result] = await getPool().execute(
        `INSERT INTO submissions (team_id, event_id, title, description, github_link) 
         VALUES (?, ?, ?, ?, ?)`,
        [team_id, event_id || null, title, description, github_link]
      );

      return this.findById(result.insertId);

    } catch (error) {
      console.error('❌ submit error:', error);
      throw new Error('Failed to create submission');
    }
  }


  // ======================
  // Update submission
  // ======================
  static async update(id, updates, values) {
    try {
      if (!updates.length) throw new Error('No fields to update');

      await getPool().execute(
        `UPDATE submissions SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return this.findById(id);

    } catch (error) {
      console.error('❌ update error:', error);
      throw new Error('Failed to update submission');
    }
  }


  // ======================
  // Get single submission
  // ======================
  static async findById(id) {
    try {
      const [rows] = await getPool().execute(`
        SELECT 
          s.id,
          s.title,
          s.description,
          s.github_link,
          s.team_id,
          s.event_id,
          t.team_name,
          e.name AS event_name,
          COALESCE(AVG(sc.score), 0) AS avg_score,
          COUNT(sc.id) AS score_count

        FROM submissions s
        JOIN teams t ON s.team_id = t.id
        LEFT JOIN events e ON s.event_id = e.id
        LEFT JOIN scores sc ON sc.submission_id = s.id

        WHERE s.id = ?
        GROUP BY s.id, t.team_name, e.name
      `, [id]);

      return rows[0] || null;

    } catch (error) {
      console.error('❌ findById error:', error);
      return null;
    }
  }


  // ======================
  // Find by team
  // ======================
  static async findByTeam(team_id) {
    try {
      const [rows] = await getPool().execute(
        `SELECT id FROM submissions WHERE team_id = ?`,
        [team_id]
      );

      return rows[0] || null;

    } catch (error) {
      console.error('❌ findByTeam error:', error);
      return null;
    }
  }


  // ======================
  // Verify access
  // ======================
  static async verifyTeamAccess(submission_id, user_id) {
    try {
      const [rows] = await getPool().execute(`
        SELECT s.id 
        FROM submissions s
        JOIN teams t ON s.team_id = t.id
        JOIN team_members tm ON tm.team_id = t.id
        WHERE s.id = ? AND tm.user_id = ?
      `, [submission_id, user_id]);

      return rows[0] || null;

    } catch (error) {
      console.error('❌ verifyTeamAccess error:', error);
      return null;
    }
  }


  // ======================
  // Get all submissions
  // ======================
  static async findAll(role, user_id, limit = 50, offset = 0) {
    if (!user_id && role !== 'admin') {
      throw new Error("Unauthorized: user_id is undefined");
    }

    try {
      let query = '';
      let params = [];

      // ======================
      // ADMIN
      // ======================
      if (role === 'admin') {
        query = `
          SELECT 
            s.id,
            s.title,
            s.team_id,
            t.team_name,
            e.name AS event_name,
            COALESCE(AVG(sc.score), 0) AS avg_score,
            COUNT(DISTINCT sc.id) AS score_count

          FROM submissions s
          JOIN teams t ON s.team_id = t.id
          LEFT JOIN events e ON s.event_id = e.id
          LEFT JOIN scores sc ON sc.submission_id = s.id

          GROUP BY s.id, t.team_name, e.name
          ORDER BY s.id DESC
          LIMIT ? OFFSET ?
        `;

        params = [Number(limit), Number(offset)];
      }

      // ======================
      // JUDGE
      // ======================
      else if (role === 'judge') {
        query = `
          SELECT 
            s.id,
            s.title,
            t.team_name,
            e.name AS event_name,
            COALESCE(AVG(sc.score), 0) AS avg_score,
            COUNT(DISTINCT sc.id) AS score_count,

            (
              SELECT score 
              FROM scores 
              WHERE submission_id = s.id AND judge_id = ?
            ) AS my_score

          FROM submissions s
          JOIN teams t ON s.team_id = t.id
          LEFT JOIN events e ON s.event_id = e.id
          LEFT JOIN scores sc ON sc.submission_id = s.id

          WHERE s.event_id IN (
            SELECT event_id FROM judge_assignments WHERE judge_id = ?
          )

          GROUP BY s.id, t.team_name, e.name
          ORDER BY s.id DESC
          LIMIT ? OFFSET ?
        `;

        params = [user_id, user_id, Number(limit), Number(offset)];
      }

      // ======================
      // PARTICIPANT
      // ======================
      else {
        // if no user id → return empty
        if (!user_id) return [];

        query = `
          SELECT 
            s.id,
            s.title,
            t.team_name,
            e.name AS event_name,
            COALESCE(AVG(sc.score), 0) AS avg_score,
            COUNT(DISTINCT sc.id) AS score_count

          FROM submissions s
          JOIN teams t ON s.team_id = t.id
          LEFT JOIN events e ON s.event_id = e.id
          LEFT JOIN scores sc ON sc.submission_id = s.id

          WHERE t.id IN (
            SELECT team_id FROM team_members WHERE user_id = ?
          )

          GROUP BY s.id, t.team_name, e.name
          ORDER BY s.id DESC
          LIMIT ? OFFSET ?
        `;

        params = [
          user_id,
          Number(limit),
          Number(offset)
        ];
      }

      console.log("FINAL PARAMS:", { user_id, limit: Number(limit), offset: Number(offset) });
      const [rows] = await getPool().execute(query, params);
      return rows;

    } catch (error) {
      console.error('❌ findAll error:', error);
      throw error;
    }
  }
}

module.exports = Submission;