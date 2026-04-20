// controllers/submissionController.js

const Submission = require('../models/Submission');
const Team = require('../models/Team');
const asyncHandler = require('../middleware/asyncHandler');

// ======================
// SUBMIT PROJECT
// ======================
const submitProject = asyncHandler(async (req, res) => {
  const { title, name, description, github_link } = req.body;
  const user_id = req.user?.id;
  const projectTitle = title || name;

  if (!projectTitle || !description || !github_link) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, and GitHub link are required'
    });
  }

  // DB check handled by Mongoose

  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/.+/;
  if (!githubRegex.test(github_link)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub link'
    });
  }

  const team = await Team.findByUser(user_id);

  if (!team) {
    return res.status(400).json({
      success: false,
      message: 'You must be in a team'
    });
  }

  const existing = await Submission.findByTeam(team.id);
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Already submitted'
    });
  }

  const submission = await Submission.submit({
    team_id: team.id,
    event_id: team.event_id,
    title: projectTitle,
    description,
    github_link
  });

  res.status(201).json({
    success: true,
    submission,
    message: 'Project submitted successfully'
  });
});

// ======================
// UPDATE PROJECT
// ======================
const updateProject = asyncHandler(async (req, res) => {
  const { title, description, github_link } = req.body;
  const submission_id = req.params.id;

  const validAccess = await Submission.verifyTeamAccess(submission_id, req.user.id);

  if (!validAccess) {
    return res.status(404).json({
      success: false,
      message: 'Access denied'
    });
  }

  const updates = [];
  const values = [];

  if (title) { updates.push('title = ?'); values.push(title); }
  if (description) { updates.push('description = ?'); values.push(description); }
  if (github_link) { updates.push('github_link = ?'); values.push(github_link); }

  if (!updates.length) {
    return res.status(400).json({
      success: false,
      message: 'Nothing to update'
    });
  }

  values.push(submission_id);

  const submission = await Submission.update(submission_id, updates, values);

  res.json({
    success: true,
    submission,
    message: 'Updated successfully'
  });
});

// ======================
// GET ALL PROJECTS
// ======================
const getAllProjects = asyncHandler(async (req, res) => {

  const submissions = await Submission.findAll(
    req.user.role,
    req.user.id,
    Number(req.query.limit) || 50,
    Number(req.query.offset) || 0
  );

  res.json({
    success: true,
    submissions: submissions || [],
    message: 'Submissions fetched'
  });
});

// ======================
// GET PROJECT BY ID
// ======================
const getProjectById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }

  const Score = require('../models/Score');
  submission.scores = await Score.getScoresBySubmission(req.params.id) || [];

  res.json({
    success: true,
    submission,
    message: 'Fetched successfully'
  });
});

module.exports = {
  submitProject,
  updateProject,
  getAllProjects,
  getProjectById
};
