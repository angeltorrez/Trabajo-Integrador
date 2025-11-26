// Utility helpers for the server
// Currently contains an asyncHandler to wrap async route handlers

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
