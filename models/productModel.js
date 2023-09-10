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
      category: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      note: DataTypes.TEXT,
      reorderThreshold: DataTypes.INTEGER,
      reorderQuantity: DataTypes.INTEGER,
      quentintyOnHand: DataTypes.INTEGER,

    },
    {
      sequelize,
      modelName: 'Product',
    }
  );


  return Product;
};

