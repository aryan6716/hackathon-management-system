// controllers/submissionController.js
// Handles project submissions by teams

const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * POST /api/submissions
 */
const submitProject = asyncHandler(async (req, res) => {
  const { title, description, github_link, event_id } = req.body;
  const user_id = req.user?.id;

  // ✅ Validation
  if (!title || !description || !github_link) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, and GitHub link are required'
    });
  }

  let dbConnected = false;
  try {
    require('../config/db').getPool();
    dbConnected = true;
  } catch(e) {}

  // ✅ Mock fallback
  if (!dbConnected) {
    return res.status(201).json({
      success: true,
      message: 'Submission successful (Mock Mode)',
      data: {
        id: Date.now(),
        title,
        description,
        github_link,
        team_name: 'Demo Team'
      }
    });
  }

  // ✅ GitHub validation
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/.+/;
  if (!githubRegex.test(github_link)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub repository link'
    });
  }

  try {
    // ✅ Team check
    const team = await Team.findByUser(user_id);

    if (!team || (event_id && team.event_id != event_id)) {
      return res.status(400).json({
        success: false,
        message: 'You must be in a team for this event'
      });
    }

    // ✅ Event deadline check
    if (team.event_id) {
      const event = await Event.findById(team.event_id);

      if (event && new Date() > new Date(event.end_date)) {
        return res.status(400).json({
          success: false,
          message: 'Submission deadline has passed'
        });
      }
    }

    // ✅ Prevent duplicate submission
    const existing = await Submission.findByTeam(team.id);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Team already submitted a project'
      });
    }

    // ✅ Create submission
    const submission = await Submission.submit({
      team_id: team.id,
      event_id: team.event_id,
      title,
      description,
      github_link
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Project submitted successfully'
    });

  } catch (error) {
    console.error('Submit project error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to submit project'
    });
  }
});


/**
 * PUT /api/submissions/:id
 */
const updateProject = asyncHandler(async (req, res) => {
  const { title, description, github_link } = req.body;
  const submission_id = req.params.id;

  try {
    const validAccess = await Submission.verifyTeamAccess(submission_id, req.user.id);

    if (!validAccess) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found or access denied'
      });
    }

    const updates = [];
    const values = [];

    if (title) { updates.push('title = ?'); values.push(title); }
    if (description) { updates.push('description = ?'); values.push(description); }
    if (github_link) { updates.push('github_link = ?'); values.push(github_link); }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to update'
      });
    }

    values.push(submission_id);

    const submission = await Submission.update(submission_id, updates, values);

    res.json({
      success: true,
      data: submission,
      message: 'Submission updated successfully'
    });

  } catch (error) {
    console.error('Update project error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});


/**
 * GET /api/submissions
 */
const getAllProjects = asyncHandler(async (req, res) => {
  let dbConnected = false;
  try {
    require('../config/db').getPool();
    dbConnected = true;
  } catch(e) {}

  // ✅ Mock fallback
  if (!dbConnected) {
    return res.json({
      success: true,
      message: 'Mock submissions fetched',
      data: [
        {
          id: 1,
          title: 'AI Health Diagnostic',
          team_name: 'NeuralNomads',
          event_name: 'AI Hackathon',
          avg_score: 9.5,
          score_count: 3
        }
      ]
    });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const limit = Math.max(1, Number(req.query.limit) || 50);
    const offset = Math.max(0, Number(req.query.offset) || 0);

    console.log("REQ USER:", req.user);
    console.log("QUERY PARAMS:", { limit, offset });

    const submissions = await Submission.findAll(req.user.role, req.user.id, limit, offset);

    res.json({
      success: true,
      data: submissions || [],
      message: 'Submissions fetched successfully'
    });

  } catch (error) {
    console.error('findAll error:', error);

    res.json({
      success: true,
      data: []
    });
  }
});


/**
 * GET /api/submissions/:id
 */
const getProjectById = asyncHandler(async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    const Score = require('../models/Score');
    const scores = await Score.getScoresBySubmission(req.params.id);

    submission.scores = scores || [];

    res.json({
      success: true,
      data: submission,
      message: 'Submission fetched successfully'
    });

  } catch (error) {
    console.error('Get submission error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission'
    });
  }
});


module.exports = {
  submitProject,
  updateProject,
  getAllProjects,
  getProjectById
};