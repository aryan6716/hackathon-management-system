// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
require('dotenv').config();

// ======================
// TOKEN GENERATOR
// ======================
const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ======================
// REGISTER
// ======================
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  // ✅ Validation
  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: '⚠️ All fields are required'
    });
  }

  // ✅ Check existing user
  const existing = await User.findByEmail(normalizedEmail);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: '⚠️ Email already registered'
    });
  }

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Create user (safe role)
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'participant'
  });

  res.status(201).json({
    success: true,
    token: generateToken(user),
    user,
    message: '🎉 Registration successful!'
  });
});

// ======================
// LOGIN
// ======================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: '⚠️ Email and password required'
    });
  }

  const user = await User.findByEmail(normalizedEmail);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: '❌ Invalid email or password'
    });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: '❌ Invalid email or password'
    });
  }

  const safeUser = await User.findById(user.id);

  res.json({
    success: true,
    token: generateToken(safeUser),
    user: safeUser,
    message: '✅ Login successful!'
  });
});

// ======================
// GET CURRENT USER
// ======================
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    user
  });
});

module.exports = { register, login, getMe };
