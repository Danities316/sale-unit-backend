'use strict';
const {
  Model
} = require('sequelize');
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
  TenantConfig.init({
    databaseName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    host: DataTypes.STRING,
    tenantID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TenantConfig',
  });
  return TenantConfig;
};