'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const Product = require('./productModel');
const Business = require('./businessModel');

module.exports = (sequelize) => {
  class Purchase extends Model {
    static associate(models) {
      // Define other associations here
      Purchase.belongsTo(models.Business, { foreignKey: 'id' });
      Purchase.belongsTo(models.Product, { foreignKey: 'id' });
    }
  }
  Purchase.init(
    {
      productName: DataTypes.STRING,
      paidBy: DataTypes.ENUM('Transfer', 'Card', 'Cash', 'POS'),
      description: DataTypes.STRING,
      unit: DataTypes.STRING,
      purchaseImage: DataTypes.STRING,
      purchaseDateDate: DataTypes.DATE,
      amount: DataTypes.FLOAT,
      costPrice: DataTypes.FLOAT,
      sellingPrice: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
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
          model: 'products',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Purchase',
    },
  );
  return Purchase;
};
