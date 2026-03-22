// controllers/leaderboardController.js

const Score = require('../models/Score');
const asyncHandler = require('../middleware/asyncHandler');
const { getPool } = require('../config/db');

// ======================
// SUBMIT SCORE
// ======================
const submitScore = asyncHandler(async (req, res) => {
  const { submission_id, score, feedback } = req.body;
  const judge_id = req.user?.id;

  const numScore = parseFloat(score);

  if (isNaN(numScore) || numScore < 0 || numScore > 10) {
    return res.status(400).json({
      success: false,
      message: 'Score must be between 0 and 10'
    });
  }

  await Score.submitScore({
    submission_id,
    judge_id,
    score: numScore,
    feedback
  });

  res.status(201).json({
    success: true,
    message: 'Score recorded successfully'
  });
});

// ======================
// GET LEADERBOARD
// ======================
const getLeaderboard = asyncHandler(async (req, res) => {
  let dbConnected = true;

  try {
    getPool(); // ✅ clean check
  } catch (e) {
    dbConnected = false;
  }

  // ======================
  // FALLBACK DATA
  // ======================
  if (!dbConnected) {
    return res.json({
      success: true,
      leaderboard: [
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
      ],
      message: 'Mock leaderboard'
    });
  }

  const event_id = req.params.eventId || req.query.event_id || null;
  const limit = Math.max(1, parseInt(req.query.limit) || 50);
  const offset = Math.max(0, parseInt(req.query.offset) || 0);

  const leaderboard = await Score.getLeaderboard(event_id, limit, offset);

  const formatted = (leaderboard || []).map(row => ({
    ...row,
    avg_score: Number(parseFloat(row.avg_score || 0).toFixed(1))
  }));

  res.json({
    success: true,
    leaderboard: formatted,
    message: 'Leaderboard fetched successfully'
  });
});

module.exports = { submitScore, getLeaderboard };