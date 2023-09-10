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
      vendor: DataTypes.STRING,
      paymentMethod: DataTypes.ENUM("Transfer", "Card", "Cash"),
      invoiceNumber: DataTypes.STRING,
      purchaseDateDate: DataTypes.DATE,
      Amount: DataTypes.FLOAT,
      unitPrice: DataTypes.FLOAT,
      totalPrice: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,

    },
    {
      sequelize,
      modelName: 'Purchase',
    }
  );
  return Purchase;
};
