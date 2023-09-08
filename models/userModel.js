// models/user.js in tenant-specific database
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init({}, { sequelize, modelName: 'User' });

  return User;
};
