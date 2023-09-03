const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'your_database_host',
  username: 'your_database_username',
  password: 'your_database_password',
  database: 'your_database_name',
});

module.exports = sequelize;
