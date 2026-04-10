// backend/controllers/statsController.js

const { getPool } = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/stats
const getStats = asyncHandler(async (req, res) => {
  let pool;

  try {
    pool = getPool();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable'
    });
  }

  // ✅ Use single pool instance
  const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
  const [events] = await pool.execute('SELECT COUNT(*) as count FROM events WHERE end_date > NOW()');
  const [teams] = await pool.execute('SELECT COUNT(*) as count FROM teams');
  const [projects] = await pool.execute('SELECT COUNT(*) as count FROM submissions');

  res.json({
    success: true,
    stats: {
      totalUsers: users[0].count,
      activeEvents: events[0].count,
      totalTeams: teams[0].count,
      totalProjects: projects[0].count
    },
    message: 'Stats fetched successfully'
  });
});

module.exports = { getStats };
