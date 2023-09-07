const sequelize = require('../../config/database');
const { QueryTypes, Sequelize } = require('sequelize');
const { masterSequelize } = require('../../config/database'); // Import the master instance
const { TenantConfig } = require('../../models'); // Import the TenantConfig model
const { Business } = require('../../models');

// Function to create a new tenant database
const createTenantDatabase = async (databaseName, username, password) => {
  try {
    // Create the database using the master Sequelize instance
    await masterSequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${databaseName}_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
       `);

  // Create a user with privileges for the new database
await masterSequelize.query(`
CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}';
`, { multiQuery: true }); // multiQuery: true allow multiple statemenent otbe run on mysql

// Grant privileges to the user for the new database
await masterSequelize.query(`
  GRANT ALL PRIVILEGES ON ${databaseName}_db.* TO '${username}'@'localhost';
`, { multiQuery: true }); 

// Reload privileges to apply the changes
await masterSequelize.query('FLUSH PRIVILEGES;', { multiQuery: true });

  } catch (error) {
    console.error('Failed to create tenant database:', error);
    return res.status(500).json("Failed to create tenant database");
  }
};

const switchTenant = async (req, res, next) => {
  const { userId } = req.user;
 

  try {
    // Fetch the tenant-specific configuration from the database
    const tenantConfig = await TenantConfig.findOne({
      where: { userId: userId },
    });


    if (!tenantConfig) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    console.log(
      `Tenant with database config: ${tenantConfig.password} amd ${tenantConfig.username}  amd ${tenantConfig.databaseName}  amd ${tenantConfig.host} is switched  `,
    );

    // Create a new Sequelize instance with the retrieved tenant-specific configuration
    const tenantSequelize = new Sequelize(
      tenantConfig.databaseName,
      tenantConfig.username,
      tenantConfig.password,
      {
        host: tenantConfig.host,
        dialect: 'mysql', 
      },
    );

    // Authenticate with the tenant-specific database
    await tenantSequelize.authenticate();


    await Business.sync();


    // Replace the default Sequelize instance with the tenant-specific one
    //This means that all subsequent database operations
    //in the current request/response cycle will be performed on the tenant's database.
    req.tenantSequelize = tenantSequelize;

    next();
  } catch (error) {
    console.error('Failed to switch tenant:', error);
    return res.status(500).json({ message: 'Internal Server Error, there is an error swiwting Tenants database' });

  }
}




module.exports = { switchTenant, createTenantDatabase };
