// backend/routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const { submitScore, getLeaderboard } = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/:eventId?', getLeaderboard);
router.post('/score', authMiddleware, roleMiddleware(['judge']), submitScore);

module.exports = router;
