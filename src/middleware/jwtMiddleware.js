const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// function authenticateJWT(req, res, next) {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error('Invalid Token:', err);
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     req.user = user;
//     next();
//   });
// }

// module.exports = authenticateJWT
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  console.log('Received Token:', token); // Log the token for debugging

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Invalid Token:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateJWT;

