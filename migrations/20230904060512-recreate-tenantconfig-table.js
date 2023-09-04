module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the existing table if it exists
    await queryInterface.dropTable('tenant_configs');

    // Create a new table named 'TenantConfig' with the desired schema
    await queryInterface.createTable('TenantConfig', {
      tenantId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      databaseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      host: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Add other configuration fields as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the 'TenantConfig' table if it exists
    await queryInterface.dropTable('TenantConfig');
  },
};
