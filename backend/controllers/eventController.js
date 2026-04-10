// controllers/eventController.js
const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');

// CREATE EVENT
const createEvent = asyncHandler(async (req, res) => {
  const { name, title, description, start_date, end_date } = req.body;
  const eventName = name || title;

  if (!eventName || !start_date || !end_date)
    return res.status(400).json({ success: false, message: 'Event name, start date, and end date are required.' });

  if (new Date(start_date) >= new Date(end_date))
    return res.status(400).json({ success: false, message: 'Start date must be before end date.' });

  const event = await Event.create({
    name: eventName,
    description,
    start_date,
    end_date,
    created_by: req.user.id
  });

  res.status(201).json({
    success: true,
    event,
    message: 'Event created successfully!'
  });
});

// GET ALL EVENTS
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.findAll();

  res.json({
    success: true,
    events,
    message: 'Events fetched'
  });
});

// GET EVENT BY ID
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event)
    return res.status(404).json({ success: false, message: 'Event not found.' });

  res.json({
    success: true,
    event,
    message: 'Event loaded'
  });
});

// ASSIGN JUDGE
const assignJudge = asyncHandler(async (req, res) => {
  const { judge_id } = req.body;
  const event_id = req.params.id;

  const User = require('../models/User');
  const judge = await User.findById(judge_id);

  if (!judge || judge.role !== 'judge')
    return res.status(404).json({ success: false, message: 'Judge not found or invalid.' });

  const isAssigned = await Event.isJudgeAssigned(judge_id, event_id);

  if (isAssigned)
    return res.status(409).json({ success: false, message: 'Judge already assigned.' });

  await Event.assignJudge(judge_id, event_id);

  res.status(201).json({
    success: true,
    message: `Judge ${judge.name} assigned successfully`
  });
});

// GET EVENT JUDGES
const getEventJudges = asyncHandler(async (req, res) => {
  const judges = await Event.getJudges(req.params.id);

  res.json({
    success: true,
    judges,
    message: 'Judges loaded'
  });
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  assignJudge,
  getEventJudges
};
