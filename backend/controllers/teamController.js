// controllers/teamController.js

const Team = require('../models/Team');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');

const generateTeamCode = () =>
  crypto.randomBytes(3).toString('hex').toUpperCase();

// ======================
// CREATE TEAM
// ======================
const createTeam = asyncHandler(async (req, res) => {
  const { team_name, name, event_id } = req.body;
  const leader_id = req.user.id;
  const teamName = team_name || name;

  if (!teamName) {
    return res.status(400).json({
      success: false,
      message: 'Team name is required'
    });
  }

  if (event_id) {
    const hasTeam = await Team.hasTeamForEvent(leader_id, event_id);
    if (hasTeam) {
      return res.status(400).json({
        success: false,
        message: 'Already in a team for this event'
      });
    }
  }

  const existing = await Team.findByName(teamName);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Team name already taken'
    });
  }

  let teamCode;
  let exists = true;

  while (exists) {
    teamCode = generateTeamCode();
    exists = !!(await Team.findByCode(teamCode));
  }

  const teamId = await Team.create({
    team_name: teamName,
    leader_id,
    event_id,
    team_code: teamCode
  });

  await Team.addMember(teamId, leader_id);

  const team = await Team.findById(teamId);

  res.status(201).json({
    success: true,
    team,
    team_code: teamCode,
    message: `Team created! Code: ${teamCode}`
  });
});

// ======================
// JOIN TEAM
// ======================
const joinTeam = asyncHandler(async (req, res) => {
  const { team_code } = req.body;
  const user_id = req.user.id;

  if (!team_code) {
    return res.status(400).json({
      success: false,
      message: 'Team code required'
    });
  }

  const team = await Team.findByCode(team_code.toUpperCase());

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Invalid team code'
    });
  }

  const isMember = await Team.isMember(team.id, user_id);
  if (isMember) {
    return res.status(400).json({
      success: false,
      message: 'Already a member'
    });
  }

  if (team.event_id) {
    const hasTeam = await Team.hasTeamForEvent(user_id, team.event_id);
    if (hasTeam) {
      return res.status(400).json({
        success: false,
        message: 'Already in another team'
      });
    }
  }

  await Team.addMember(team.id, user_id);

  res.json({
    success: true,
    team,
    message: `Joined ${team.team_name}`
  });
});

// ======================
// GET ALL TEAMS
// ======================
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.findAll();

  res.json({
    success: true,
    teams,
    message: 'Teams fetched'
  });
});

// ======================
// GET MY TEAM
// ======================
const getMyTeam = asyncHandler(async (req, res) => {
  const team = await Team.findByUser(req.user.id);

  if (!team) {
    return res.json({
      success: true,
      team: null,
      message: 'No team found'
    });
  }

  team.members = await Team.getMembers(team.id);

  res.json({
    success: true,
    team,
    message: 'Team fetched'
  });
});

// ======================
// GET TEAM BY ID
// ======================
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  team.members = await Team.getMembers(team.id);

  res.json({
    success: true,
    team,
    message: 'Team fetched'
  });
});

module.exports = {
  createTeam,
  joinTeam,
  getAllTeams,
  getMyTeam,
  getTeamById
};
