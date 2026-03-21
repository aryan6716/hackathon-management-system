// backend/controllers/statsController.js
const { getPool } = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/stats
const getStats = asyncHandler(async (req, res) => {
  let dbConnected = false;
  try {
    getPool();
    dbConnected = true;
  } catch (err) {}

  if (!dbConnected) {
    return res.json({ 
      success: true, 
      data: { totalUsers: 8, activeEvents: 2, totalTeams: 5, totalProjects: 3 },
      message: 'Mock stats fetched successfully.' 
    });
  }

  const [users] = await getPool().execute('SELECT COUNT(*) as count FROM users');
  const [events] = await getPool().execute('SELECT COUNT(*) as count FROM events WHERE end_date > NOW()');
  const [teams] = await getPool().execute('SELECT COUNT(*) as count FROM teams');
  const [projects] = await getPool().execute('SELECT COUNT(*) as count FROM submissions');

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
