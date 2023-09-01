const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded; // Attach user information to the request object if needed
    next(); // Continue to the protected route if the token is valid
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
