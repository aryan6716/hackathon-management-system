// backend/controllers/statsController.js

const User = require('../models/User');
const Event = require('../models/Event');
const Team = require('../models/Team');
const Submission = require('../models/Submission');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/stats
const getStats = asyncHandler(async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const eventsCount = await Event.countDocuments({ end_date: { $gt: new Date() } });
    const teamsCount = await Team.countDocuments();
    const projectsCount = await Submission.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers: usersCount,
        activeEvents: eventsCount,
        totalTeams: teamsCount,
        totalProjects: projectsCount
      },
      message: 'Stats fetched successfully'
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable or error fetching stats'
    });
  }
});

module.exports = { getStats };
