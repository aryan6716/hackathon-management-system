// middleware/roleMiddleware.js
// Role-based access control middleware

/**
 * roleMiddleware: Factory function that returns a middleware
 * restricting access to users with specific roles.
 * 
 * Usage: roleMiddleware('admin') or roleMiddleware('admin', 'judge')
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // authMiddleware must run first to populate req.user
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated.' 
      });
    }

    // Check if the user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
