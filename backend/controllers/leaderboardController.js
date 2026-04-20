// controllers/leaderboardController.js

const Score = require('../models/Score');
const asyncHandler = require('../middleware/asyncHandler');

// ======================
// SUBMIT SCORE
// ======================
const submitScore = asyncHandler(async (req, res) => {
  const { submission_id, score, feedback } = req.body;
  const judge_id = req.user?.id;

  if (!submission_id) {
    return res.status(400).json({
      success: false,
      message: 'submission_id is required'
    });
  }

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
