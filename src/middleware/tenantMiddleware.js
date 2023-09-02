const { Sequelize } = require('sequelize');

// Function to create a Sequelize instance for a specific tenant
const createTenantDatabase = (tenantConfig) => {
  return new Sequelize(tenantConfig);
}

module.exports = (req, res, next) => {
  const tenantId = req.user.tenantId; // Assuming you've identified the tenant somehow
  const tenantConfig = require(`../config/tenantConfigs/${tenantId}.json`); // Load the tenant-specific database config

  const tenantDatabase = createTenantDatabase(tenantConfig);
  req.tenantDatabase = tenantDatabase; // Attach the tenant-specific Sequelize instance to the request object

  next();
};
