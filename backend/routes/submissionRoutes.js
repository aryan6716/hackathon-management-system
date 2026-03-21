// backend/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { submitProject, updateProject, getAllProjects, getProjectById } = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllProjects);
router.get('/:id', getProjectById);

router.post('/', authMiddleware, submitProject);
router.put('/:id', authMiddleware, updateProject);

module.exports = router;
