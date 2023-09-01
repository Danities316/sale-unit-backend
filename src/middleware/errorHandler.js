// Custom error handling middleware
exports.errorHandler = (err, req, res, next) => {
  // Default values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error for debugging purposes
  console.error(err.stack);

  // Respond with the error
  res.status(statusCode).json({ error: message });
};
