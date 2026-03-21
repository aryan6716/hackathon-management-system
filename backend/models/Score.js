// backend/models/Score.js

const { getPool } = require('../config/db');

// ======================
// Simple in-memory cache (5 sec)
// ======================
let leaderboardCache = new Map();

class Score {

  // ======================
  // Submit / Update Score
  // ======================
  static async submitScore({ submission_id, judge_id, score, feedback }) {
    try {
      await getPool().execute(
        `INSERT INTO scores (submission_id, judge_id, score, feedback) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           score = VALUES(score), 
           feedback = VALUES(feedback), 
           scored_at = CURRENT_TIMESTAMP`,
        [submission_id, judge_id, score, feedback || '']
      );

      // 🧠 Invalidate entire cache map when new score is added
      leaderboardCache.clear();

    } catch (error) {
      console.error('submitScore error:', error);
      throw new Error('Failed to submit score');
    }
  }


  // ======================
  // Get scores for one submission
  // ======================
  static async getScoresBySubmission(submission_id) {
    try {
      const [rows] = await getPool().execute(
        `SELECT sc.id, sc.score, sc.feedback, sc.scored_at,
                u.name AS judge_name
         FROM scores sc
         JOIN users u ON sc.judge_id = u.id
         WHERE sc.submission_id = ?`,
        [submission_id]
      );

      return rows;

    } catch (error) {
      console.error('getScoresBySubmission error:', error);
      return [];
    }
  }


  // ======================
  // Leaderboard (OPTIMIZED & PAGINATED)
  // ======================
  static async getLeaderboard(event_id, limit = 50, offset = 0) {
    try {
      const cacheKey = `board_${event_id || 'all'}_${limit}_${offset}`;
      const cached = leaderboardCache.get(cacheKey);

      // ⚡ Use cache if fresh (5 sec)
      if (cached && Date.now() - cached.timestamp < 5000) {
        return cached.data;
      }

      let query = `
        SELECT 
          sub.id AS submission_id,
          sub.title,
          t.team_name,
          e.name AS event_name,
          e.id AS event_id,
          ROUND(COALESCE(AVG(sc.score), 0), 1) AS avg_score,
          COUNT(sc.id) AS judge_count

        FROM submissions sub

        JOIN teams t ON sub.team_id = t.id
        LEFT JOIN events e ON sub.event_id = e.id
        LEFT JOIN scores sc ON sc.submission_id = sub.id
      `;

      const params = [];

      if (event_id) {
        query += ` WHERE sub.event_id = ? `;
        params.push(event_id);
      }

      query += `
        GROUP BY sub.id
        HAVING judge_count > 0
        ORDER BY avg_score DESC
        LIMIT ? OFFSET ?
      `;
      
      params.push(limit.toString());
      params.push(offset.toString());

      const [rows] = await getPool().execute(query, params);

      // 🧠 Save to cache
      leaderboardCache.set(cacheKey, {
        data: rows,
        timestamp: Date.now()
      });

      return rows;

    } catch (error) {
      console.error('getLeaderboard error:', error);
      return [];
    }
  }
}

module.exports = Score;