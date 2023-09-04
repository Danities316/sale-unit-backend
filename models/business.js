'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Business extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Business.init(
    {
      BusinessID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      BusinessName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      BusinessCategory: DataTypes.STRING,
      City: DataTypes.STRING,
      YearFounded: DataTypes.DATE,
      BusinessDescription: DataTypes.TEXT,
      BusinessLogo: DataTypes.STRING,
      RegNo: DataTypes.BOOLEAN,
      TenantID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Business',
    },
  );

  return Business;
};
