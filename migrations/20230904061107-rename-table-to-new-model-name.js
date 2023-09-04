module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('TenantConfigs', 'TenantConfigs'); // Replace 'new_model_name' with your new model name
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('TenantConfigs', 'TenantConfigs');
  },
};
