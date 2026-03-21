// backend/routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const { createTeam, joinTeam, getAllTeams, getMyTeam, getTeamById } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllTeams);
router.get('/my', authMiddleware, getMyTeam);
router.get('/:id', getTeamById);

router.post('/', authMiddleware, createTeam);
router.post('/join', authMiddleware, joinTeam);

module.exports = router;
