'use strict';
const { Model, DataTypes } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance
const User = require('./userModel'); 
const Business = require('./businessModel'); 


module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
      // Define other associations here
      // Notification.belongsTo(models.User, { foreignKey: 'id' });
      // Notification.belongsTo(models.Business, { foreignKey: 'id' });

    }
  }
  Notification.init(
    {
      notificationType: DataTypes.STRING,
      Message: DataTypes.STRING,
      timestamp: DataTypes.DATE,
      isRead: DataTypes.BOOLEAN,
      Date: DataTypes.DATE,

    },
    {
      sequelize,
      modelName: 'Notification',
    }
  );

  return Notification;
};

