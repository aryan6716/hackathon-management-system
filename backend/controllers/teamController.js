// controllers/teamController.js
const Team = require('../models/Team');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');

const generateTeamCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

// POST /api/teams
const createTeam = asyncHandler(async (req, res) => {
  const { team_name, event_id } = req.body;
  const leader_id = req.user.id;

  if (!team_name)
    return res.status(400).json({ success: false, message: 'Team name is required.' });

  if (event_id) {
    const hasTeam = await Team.hasTeamForEvent(leader_id, event_id);
    if (hasTeam)
      return res.status(400).json({ success: false, message: 'You are already in a team for this event.' });
  }

  const existingTeam = await Team.findByName(team_name);
  if (existingTeam)
    return res.status(409).json({ success: false, message: 'Team name already taken. Choose another name.' });

  let teamCode;
  let codeExists = true;
  while (codeExists) {
    teamCode = generateTeamCode();
    codeExists = !!(await Team.findByCode(teamCode));
  }

  const teamId = await Team.create({ team_name, leader_id, event_id, team_code: teamCode });
  await Team.addMember(teamId, leader_id);

  const team = await Team.findById(teamId);
  res.status(201).json({ success: true, data: team, message: `Team "${team_name}" created! Share code: ${teamCode}` });
});

// POST /api/teams/join
const joinTeam = asyncHandler(async (req, res) => {
  const { team_code } = req.body;
  const user_id = req.user.id;

  if (!team_code)
    return res.status(400).json({ success: false, message: 'Team code is required.' });

  const team = await Team.findByCode(team_code.toUpperCase());
  if (!team)
    return res.status(404).json({ success: false, message: 'Invalid team code. No team found.' });

  const isMember = await Team.isMember(team.id, user_id);
  if (isMember)
    return res.status(400).json({ success: false, message: 'You are already a member of this team.' });

  if (team.event_id) {
    const hasTeam = await Team.hasTeamForEvent(user_id, team.event_id);
    if (hasTeam)
      return res.status(400).json({ success: false, message: 'You are already in another team for this event.' });
  }

  await Team.addMember(team.id, user_id);
  res.json({ success: true, data: team, message: `Successfully joined team "${team.team_name}"!` });
});

// GET /api/teams
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.findAll();
  res.json({ success: true, data: teams, message: 'Teams fetched' });
});

// GET /api/teams/my
const getMyTeam = asyncHandler(async (req, res) => {
  const team = await Team.findByUser(req.user.id);
  if (!team)
    return res.json({ success: true, data: null, message: 'You are not in any team.' });

  team.members = await Team.getMembers(team.id);
  res.json({ success: true, data: team, message: 'Team fetched' });
});

// GET /api/teams/:id
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team)
    return res.status(404).json({ success: false, message: 'Team not found.' });

  team.members = await Team.getMembers(team.id);
  res.json({ success: true, data: team, message: 'Team fetched' });
});

module.exports = { createTeam, joinTeam, getAllTeams, getMyTeam, getTeamById };
