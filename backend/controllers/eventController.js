// controllers/eventController.js
const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');

// POST /api/events (Admin only)
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, start_date, end_date } = req.body;
  if (!name || !start_date || !end_date)
    return res.status(400).json({ success: false, message: 'Event name, start date, and end date are required.' });

  if (new Date(start_date) >= new Date(end_date))
    return res.status(400).json({ success: false, message: 'Start date must be before end date.' });

  const event = await Event.create({ name, description, start_date, end_date, created_by: req.user.id });
  res.status(201).json({ success: true, data: event, message: 'Event created successfully!' });
});

// GET /api/events
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.findAll();
  res.json({ success: true, data: events, message: 'Events fetched' });
});

// GET /api/events/:id
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event)
    return res.status(404).json({ success: false, message: 'Event not found.' });

  res.json({ success: true, data: event, message: 'Event loaded' });
});

// POST /api/events/:id/assign-judge (Admin only)
const assignJudge = asyncHandler(async (req, res) => {
  const { judge_id } = req.body;
  const event_id = req.params.id;

  const User = require('../models/User');
  const judge = await User.findById(judge_id);
  
  if (!judge || judge.role !== 'judge')
    return res.status(404).json({ success: false, message: 'Judge not found or user is not a judge.' });

  const isAssigned = await Event.isJudgeAssigned(judge_id, event_id);
  if (isAssigned)
    return res.status(409).json({ success: false, message: 'Judge already assigned to this event.' });

  await Event.assignJudge(judge_id, event_id);
  res.status(201).json({ success: true, message: `Judge ${judge.name} assigned to event successfully!` });
});

// GET /api/events/:id/judges
const getEventJudges = asyncHandler(async (req, res) => {
  const judges = await Event.getJudges(req.params.id);
  res.json({ success: true, data: judges, message: 'Judges loaded' });
});

module.exports = { createEvent, getAllEvents, getEventById, assignJudge, getEventJudges };
