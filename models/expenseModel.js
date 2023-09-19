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
      productName: DataTypes.STRING,
      paidBy: DataTypes.ENUM('Transfer', 'Card', 'Cash', 'POS'),
      expenseCategory: DataTypes.STRING,
      receiptImage: DataTypes.STRING,
      expenseDate: DataTypes.DATE,
      amount: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      description: DataTypes.TEXT,
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
