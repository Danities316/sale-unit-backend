// models/user.js in tenant-specific database
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Users extends Model {}

  Users.init({}, { sequelize, modelName: 'Users' });

  return Users;
};
