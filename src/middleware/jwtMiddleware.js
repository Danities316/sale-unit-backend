const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'middleware Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Invalid Token:', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateJWT;

