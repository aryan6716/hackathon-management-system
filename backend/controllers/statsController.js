// backend/controllers/statsController.js
const { pool, getDbStatus } = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/stats
const getStats = asyncHandler(async (req, res) => {
  if (!getDbStatus()) {
    return res.json({ 
      success: true, 
      data: { totalUsers: 8, activeEvents: 2, totalTeams: 5, totalProjects: 3 },
      message: 'Mock stats fetched successfully.' 
    });
  }

  const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
  const [events] = await pool.execute('SELECT COUNT(*) as count FROM events WHERE end_date > NOW()');
  const [teams] = await pool.execute('SELECT COUNT(*) as count FROM teams');
  const [projects] = await pool.execute('SELECT COUNT(*) as count FROM submissions');

  res.json({
    success: true,
    data: {
      totalUsers: users[0].count,
      activeEvents: events[0].count,
      totalTeams: teams[0].count,
      totalProjects: projects[0].count
    },
    message: 'Stats fetched successfully.'
  });
});

module.exports = { getStats };
