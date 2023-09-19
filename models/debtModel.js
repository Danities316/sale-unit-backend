'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const Customer = require('./customerModel');
const Business = require('./businessModel');

module.exports = (sequelize) => {
  class Debt extends Model {
    static associate(models) {
      // Define other associations here
      // Debt.belongsTo(models.Customer, { foreignKey: 'id' });
      // Debt.belongsTo(models.Business, { foreignKey: 'id' });
    }
  }
  Debt.init(
    {
      description: DataTypes.TEXT,
      debtDatee: DataTypes.DATE,
      amount: DataTypes.FLOAT,
      debtStatus: DataTypes.STRING,
      debtTypes: DataTypes.STRING,
      debtDueDate: DataTypes.DATE,
      businessId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'businesses',
          key: 'id',
        },
      },
      customerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Debt',
    },
  );

  return Debt;
};
