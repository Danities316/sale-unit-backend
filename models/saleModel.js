'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const Purchase = require('./purchaseModel');
const Business = require('./businessModel');

module.exports = (sequelize) => {
  class Sale extends Model {
    static associate(models) {
      // Define other associations here
      Sale.belongsTo(models.Business, { foreignKey: 'id' });
      Sale.belongsTo(models.Product, { foreignKey: 'id' });
    }
  }
  Sale.init(
    {
      paymentMethod: DataTypes.ENUM('Transfer', 'Card', 'Cash'),
      invoiceNumber: DataTypes.STRING,
      saleDate: DataTypes.DATE,
      note: DataTypes.TEXT,
      Amount: DataTypes.FLOAT,
      unitPrice: DataTypes.FLOAT,
      totalPrice: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      Debt: DataTypes.BOOLEAN,
      businessId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'businesses',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Sale',
    },
  );

  return Sale;
};
