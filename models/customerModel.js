'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const Business = require('../models/businessModel');

module.exports = (sequelize) => {
  class Customer extends Model {
    static associate(models) {
      // Define other associations here
      // Customer.belongsTo(models.Business, { foreignKey: 'id' });
    }
  }
  Customer.init(
    {
      name: DataTypes.STRING,
      Phone: DataTypes.INTEGER,
      businessId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'businesses',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Customer',
    },
  );

  return Customer;
};
