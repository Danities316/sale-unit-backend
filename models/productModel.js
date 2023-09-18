'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const Business = require('./businessModel');

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      // Define other associations here
      // Product.belongsTo(models.Business, { foreignKey: 'id' });
    }
  }
  Product.init(
    {
      productName: DataTypes.STRING,
      costPrice: DataTypes.FLOAT,
      sellingPrice: DataTypes.FLOAT,
      unit: DataTypes.ENUM('pack', 'canton'),
      description: DataTypes.TEXT,
      label: DataTypes.STRING,
      productImage: DataTypes.STRING,
      reorderThreshold: DataTypes.INTEGER,
      reorderQuantity: DataTypes.INTEGER,
      quentintyOnHand: DataTypes.INTEGER,
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
      modelName: 'Product',
    },
  );

  return Product;
};
