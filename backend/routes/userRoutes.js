// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAllParticipants, getUserById } = require('../controllers/userController');

router.get('/', authMiddleware, roleMiddleware(['admin', 'judge']), getAllParticipants);
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
