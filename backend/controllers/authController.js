// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
require('dotenv').config();

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });

  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

  const validRoles = ['participant', 'judge', 'admin'];
  const userRole = validRoles.includes(role) ? role : 'participant';

  const existing = await User.findByEmail(email);
  if (existing)
    return res.status(409).json({ success: false, message: 'Email already registered.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role: userRole });

  res.status(201).json({
    success: true,
    data: { token: generateToken(user), user },
    message: 'Registration successful!',
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' });

  const user = await User.findByEmail(email);
  if (!user)
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });

  const safeUser = await User.findById(user.id);
  res.json({
    success: true,
    data: { token: generateToken(safeUser), user: safeUser },
    message: 'Login successful!',
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, data: user, message: 'User profile fetched' });
});

module.exports = { register, login, getMe };
