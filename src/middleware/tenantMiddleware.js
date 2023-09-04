const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');
const TenantConfig = require('../../models').Tenantconfig; // Import the TenantConfig model

const switchTenant = async (req, res, next) => {
  const { tenantId } = req.user;

  try {
    // Fetch the tenant-specific configuration from the database
    const tenantConfig = await TenantConfig.findByPk(tenantId);

    if (!tenantConfig) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Create a new Sequelize instance with the retrieved tenant-specific configuration
    const tenantSequelize = new Sequelize(
      tenantConfig.databaseName,
      tenantConfig.username,
      tenantConfig.password,
      {
        host: tenantConfig.host,
        dialect: 'mysql', //
        // We would add other options as needed
      },
    );

    // Authenticate with the tenant-specific database
    await tenantSequelize.authenticate();

    // Replace the default Sequelize instance with the tenant-specific one
    req.app.locals.sequelize = tenantSequelize;

    next();
  } catch (error) {
    console.error('Failed to switch tenant:', error);
    res.status(500).json({ message: 'Failed to switch tenant' });
  }
};

module.exports = switchTenant;
