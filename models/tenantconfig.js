'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TenantConfig extends Model {}
  TenantConfig.init(
    {
      tenantId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      databaseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      host: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Add other configuration fields as needed
    },
    {
      sequelize,
      modelName: 'TenantConfig',
      tableName: 'tenant_configs', // You can customize the table name
    },
  );

  return TenantConfig;
};
