// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById, assignJudge, getEventJudges } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/:id/judges', authMiddleware, getEventJudges);

// Admin only routes
router.post('/', authMiddleware, roleMiddleware(['admin']), createEvent);
router.post('/:id/assign-judge', authMiddleware, roleMiddleware(['admin']), assignJudge);

module.exports = router;
