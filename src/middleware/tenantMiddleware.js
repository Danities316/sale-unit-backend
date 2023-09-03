// const { Sequelize } = require('sequelize');

// // Function to create a Sequelize instance for a specific tenant
// const createTenantDatabase = (tenantConfig) => {
//   return new Sequelize(tenantConfig);
// }

// module.exports = (req, res, next) => {
//   const tenantId = req.user.tenantId; // Assuming you've identified the tenant somehow
//   const tenantConfig = require(`../config/tenantConfigs/${tenantId}.json`); // Load the tenant-specific database config

//   const tenantDatabase = createTenantDatabase(tenantConfig);
//   req.tenantDatabase = tenantDatabase; // Attach the tenant-specific Sequelize instance to the request object

//   next();
// };

const sequelize = require('../../config/database');

const switchTenant = async (req, res, next) => {
  // Get the tenant information from the authenticated user
  const { tenantId } = req.user;

  // Dynamically set the Sequelize connection based on the tenantId
  sequelize.options.database = `tenant_${tenantId}`;
  try {
    await sequelize.authenticate();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to switch tenant' });
  }
};

module.exports = switchTenant;
