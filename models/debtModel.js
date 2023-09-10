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
      note: DataTypes.TEXT,
      debtDatee: DataTypes.DATE,
      Amount: DataTypes.FLOAT,
      debtStatus: DataTypes.STRING,

    },
    {
      sequelize,
      modelName: 'Debt',
    }
  );

  return Debt;
};

