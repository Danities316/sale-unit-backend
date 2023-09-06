const { Sequelize } = require('sequelize');
<<<<<<< HEAD
require('dotenv').config();

const masterSequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAMES,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIELECT,
    port: process.env.PORTS,
  },
);

module.exports = {
  masterSequelize,
};
=======

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'your_database_host',
  username: 'your_database_username',
  password: 'your_database_password',
  database: 'your_database_name',
});

module.exports = sequelize;
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
