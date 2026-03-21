// controllers/leaderboardController.js
// Handles leaderboard calculation and individual scoring

const Score = require('../models/Score');
const asyncHandler = require('../middleware/asyncHandler');

// POST /api/leaderboard/score
// Judges evaluating a submission
const submitScore = asyncHandler(async (req, res) => {
  const { submission_id, score, feedback } = req.body;
  const judge_id = req.user?.id;

  // ✅ Validation
  const numScore = parseFloat(score);
  if (isNaN(numScore) || numScore < 0 || numScore > 10) {
    return res.status(400).json({
      success: false,
      message: 'Score must be a number between 0 and 10'
    });
  }

  // ✅ Safe DB call
  try {
    await Score.submitScore({ submission_id, judge_id, score: numScore, feedback });

    res.status(201).json({
      success: true,
      data: null,
      message: 'Score recorded successfully'
    });

  } catch (error) {
    console.error('Submit score error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to record score'
    });
  }
});


// GET /api/leaderboard/:eventId?
// Returns full leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
  let dbConnected = false;
  try {
    require('../config/db').getPool();
    dbConnected = true;
  } catch(e) {}

  // ✅ Fallback if DB not ready
  if (!dbConnected) {
    return res.json({
      success: true,
      message: 'Mock leaderboard fetched successfully',
      data: [
        {
          id: 1,
          title: 'AI Health',
          team_name: 'NeuralNomads',
          avg_score: 9.6,
          judge_count: 3
        },
        {
          id: 2,
          title: 'Defi Protocol',
          team_name: 'CryptoGurus',
          avg_score: 8.4,
          judge_count: 2
        }
      ]
    });
  }

  const event_id = req.params.eventId || req.query.event_id || null;
  const limit = Math.max(1, parseInt(req.query.limit) || 50);
  const offset = Math.max(0, parseInt(req.query.offset) || 0);

  try {
    const leaderboard = await Score.getLeaderboard(event_id, limit, offset);

    const formattedLeaderboard = (leaderboard || []).map(row => ({
      ...row,
      avg_score: Number(parseFloat(row.avg_score || 0).toFixed(1))
    }));

    res.json({
      success: true,
      data: formattedLeaderboard,
      message: 'Leaderboard fetched successfully'
    });

  } catch (error) {
    console.error('Leaderboard error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

module.exports = { submitScore, getLeaderboard };