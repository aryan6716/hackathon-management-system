// backend/middleware/asyncHandler.js
// Custom wrapper to replace try/catch blocks in controllers

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
