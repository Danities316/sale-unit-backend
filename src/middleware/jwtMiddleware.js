const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const defineBusinessModel = require('../../models/businessModel');

async function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');
  const { tenantSequelize } = req; // Get the tenant-specific Sequelize instance

  // Define the Business model for the current tenant
  const Business = defineBusinessModel(tenantSequelize);

  if (!token) {
    return res.status(401).json({ message: 'middleware Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decodedToken;

    // Fetch and include the user's associated businessIds here
    const userBusinesses = await Business.findAll({
      where: { TenantID: decodedToken.userId },
      attributes: ['id'],
    });
    const businessIds = userBusinesses.map((business) => business.id);

    // You should replace this with your database query
    req.user.businessIds = []; // Placeholder for businessIds

    next();
  } catch (err) {
    console.error('Invalid Token:', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateJWT;
