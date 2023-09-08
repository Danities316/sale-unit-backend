'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const Customer = require('./customerModel'); 
const Sale = require('./saleModel'); 
const Debt =require('./debtModel'); 
const Expense = require('./expenseModel'); 
const Purchase = require('./purchaseModel'); 
const Product = require('./productModel'); 
const Notification = require('./notificationModel'); 
const Staff =require('./staffModel'); 

module.exports = (sequelize) => {
  class Business extends Model {
    static associate(models) {
      // Define other associations here

      Business.hasMany(sequelize.models.Customer, { foreignKey: 'id' });
      Business.hasMany(sequelize.models.Sale, { foreignKey: 'id' });
      Business.hasMany(sequelize.models.Debt, { foreignKey: 'id' });
      Business.hasMany(sequelize.models.Expense, { foreignKey: 'id' });
      Business.hasMany(sequelize.models.Purchase, { foreignKey: 'id' });
      Business.hasMany(sequelize.models.Product, { foreignKey: 'id' });
      Business.hasMany(sequelize.models.Notification, { foreignKey: 'id' });
      Business.hasMany(sequelize.models.Staff, { foreignKey: 'id' });
    }
  }
  Business.init(
    {
      BusinessName: DataTypes.STRING,
      BusinessCategory: DataTypes.STRING,
      City: DataTypes.STRING,
      YearFounded: DataTypes.DATE,
      stateOfResidence: DataTypes.STRING,
      BusinessDescription: DataTypes.TEXT,
      BusinessLogo: DataTypes.STRING,
      RegNo: DataTypes.BOOLEAN,
      TenantID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Business',
    }
  );

  // Define a foreign key constraint for the TenantID column
  sequelize.query(`
    ALTER TABLE \`Business\`
    ADD CONSTRAINT \`business_tenant_user_fk\`
    FOREIGN KEY (\`TenantID\`)
    REFERENCES \`${masterSequelize.bookkeeping_db}\`.\`Users\` (\`id\`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  `);

  return Business;
};


/// models/business.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const defineUserModel = require('../models/userModel');

// const Business = sequelize.define('Business', {
//   BusinessName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   BusinessCategory: {
//     type: DataTypes.STRING,
//   },
//   stateOfResidence: {
//     type: DataTypes.STRING,
//   },
//   YearFounded: {
//     type: DataTypes.INTEGER,
//   },
//   BusinessDescription: {
//     type: DataTypes.TEXT,
//   },
//   BusinessLogo: {
//     type: DataTypes.STRING,
//   },
//   RegNo: {
//     type: DataTypes.STRING,
//   },
//   TenantID: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'Users',
//       key: 'id',
//     },
//   },
// });
//  // Define an association to the User model in the tenant-specific database
//  Business.belongsTo(defineUserModel(sequelize), {
//   foreignKey: 'UserId', // Adjust the foreign key as needed
//   targetKey: 'id', // Target the 'id' field in the tenant-specific User model
// });

// Business.hasMany(Customer, { foreignKey: 'id' });
// Business.hasMany(Sale, { foreignKey: 'id' });
// Business.hasMany(Debt, { foreignKey: 'id' });
// Business.hasMany(Expense, { foreignKey: 'id' });
// Business.hasMany(Purchase, { foreignKey: 'id' });
// Business.hasMany(Product, { foreignKey: 'id' });
// Business.hasMany(Notification, { foreignKey: 'id' });
// Business.hasMany(Staff, { foreignKey: 'id' });

// module.exports = Business;
