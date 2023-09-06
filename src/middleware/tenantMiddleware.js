<<<<<<< HEAD
const sequelize = require('../../config/database');
const { QueryTypes, Sequelize } = require('sequelize');
const { masterSequelize } = require('../../config/database'); // Import the master instance
const { TenantConfig } = require('../../models'); // Import the TenantConfig model

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
    throw error;
  }
};

const switchTenant = async (req, res, next) => {
  const { userId } = req.user;
  console.log('This is the user: ', userId);

  try {
    // Fetch the tenant-specific configuration from the database
    const tenantConfig = await TenantConfig.findOne({
      where: { userId: userId },
    });


    if (!tenantConfig) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    console.log(
      `Tenant with database config: ${tenantConfig.password} amd ${tenantConfig.username}  amd ${tenantConfig.databaseName}_db  amd ${tenantConfig.host} is switched  `,
    );

    // Create a new Sequelize instance with the retrieved tenant-specific configuration
    const tenantSequelize = new Sequelize(
      tenantConfig.databaseName + '_db',
      tenantConfig.username,
      tenantConfig.password,
      {
        host: tenantConfig.host,
        dialect: 'mysql', 
      },
    );

    // Authenticate with the tenant-specific database
    await tenantSequelize.authenticate();
    // Test the connection
// try {
//   await tenantSequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

    // Replace the default Sequelize instance with the tenant-specific one
    //This means that all subsequent database operations
    //in the current request/response cycle will be performed on the tenant's database.
    req.app.locals.sequelize = tenantSequelize;

    next();
  } catch (error) {
    console.error('Failed to switch tenant:', error);
=======
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
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
    res.status(500).json({ message: 'Failed to switch tenant' });
  }
};

<<<<<<< HEAD
module.exports = { switchTenant, createTenantDatabase };
=======
module.exports = switchTenant;
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
