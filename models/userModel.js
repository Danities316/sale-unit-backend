const { Model, DataTypes, Sequelize } = require('sequelize');
const { masterSequelize } = require('../config/database'); // Import the master instance

const Business = require('./businessModel');

module.exports = (sequelize) => {
  class TenantUser extends Model {
    static associate(models) {
      // Define associations here if applicable
      // For example: this.hasMany(models.Post, { foreignKey: 'userId' });
      // User.hasMany(models.Business, {
      //   foreignKey: 'defaultBusinessId',
      //   as: 'defaultBusiness',
      // });
    }
  }

  TenantUser.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      password: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      RegNo: DataTypes.BOOLEAN,
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true, // Validates email format
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verificationCode: DataTypes.STRING,
      resetToken: DataTypes.STRING,
      resetTokenExpiry: DataTypes.DATE,
      defaultBusinessId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'TenantUser',
    },
  );

  return TenantUser;
};
