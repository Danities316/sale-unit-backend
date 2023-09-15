'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const Business = require('./businessModel');

module.exports = (sequelize) => {
  class Expense extends Model {
    static associate(models) {
      // Define other associations here
      Expense.belongsTo(models.Business, { foreignKey: 'id' });
    }
  }
  Expense.init(
    {
      vendor: DataTypes.STRING,
      paymentMethod: DataTypes.ENUM('Transfer', 'Card', 'Cash'),
      expenseCategory: DataTypes.STRING,
      expenseDate: DataTypes.DATE,
      Amount: DataTypes.FLOAT,
      note: DataTypes.TEXT,
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
      modelName: 'Expense',
    },
  );
  return Expense;
};
