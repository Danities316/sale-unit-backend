'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Business.init({
    BusinessName: DataTypes.STRING,
    BusinessCategory: DataTypes.STRING,
    City: DataTypes.STRING,
    YearFounded: DataTypes.DATE,
    stateOfResidence: DataTypes.STRING,
    BusinessDescription: DataTypes.TEXT,
    BusinessLogo: DataTypes.STRING,
    RegNo: DataTypes.BOOLEAN,
    TenantID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Business',
  });
  return Business;
};