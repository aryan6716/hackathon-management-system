// middleware/authMiddleware.js
// JWT verification middleware - protects routes from unauthenticated access

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * authMiddleware: Verifies the JWT token from the Authorization header.
 * Attaches the decoded user object to req.user if valid.
 */
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

module.exports = authMiddleware;
