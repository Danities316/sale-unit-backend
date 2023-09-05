const sequelize = require('../../config/database');
const { QueryTypes, Sequelize } = require('sequelize');
const { masterSequelize } = require('../../config/database'); // Import the master instance
const { TenantConfig } = require('../../models'); // Import the TenantConfig model

// Function to create a new tenant database
const createTenantDatabase = async (databaseName) => {
  try {
    // Create the database using the master Sequelize instance
    await masterSequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${databaseName};`,
    );
  } catch (error) {
    console.error('Failed to create tenant database:', error);
    throw error;
  }
};

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
    //This means that all subsequent database operations
    //in the current request/response cycle will be performed on the tenant's database.
    req.app.locals.sequelize = tenantSequelize;

    next();
  } catch (error) {
    console.error('Failed to switch tenant:', error);
    res.status(500).json({ message: 'Failed to switch tenant' });
  }
};

module.exports = { switchTenant, createTenantDatabase };
