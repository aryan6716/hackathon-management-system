// controllers/userController.js

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// ======================
// GET ALL USERS
// ======================
const getAllParticipants = asyncHandler(async (req, res) => {
  const users = await User.findAllParticipants();

  res.json({
    success: true,
    users,
    message: 'Participants fetched'
  });
});

// ======================
// GET USER BY ID
// ======================
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    user,
    message: 'User fetched'
  });
});

module.exports = {
  getAllParticipants,
  getUserById
};