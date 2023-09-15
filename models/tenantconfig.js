'use strict';
const { Model } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
module.exports = (sequelize, DataTypes) => {
  class TenantConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TenantConfig.init(
    {
      databaseName: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      host: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize: masterSequelize,
      modelName: 'TenantConfig',
    },
  );
  return TenantConfig;
};
