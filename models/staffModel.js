'use strict';
const { Model,  DataTypes } = require('sequelize');
const Business = require('./businessModel'); 

module.exports = (sequelize) => {
  class Staff extends Model {
    static associate(models) {
      // Define associations here if applicable
      Staff.belongsTo(models.Business, { foreignKey: 'id' });
    }
  }

  Staff.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      jobTitle: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      Role: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true, // Validates email format
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Staff',
    }
  );
  return Staff;
};
