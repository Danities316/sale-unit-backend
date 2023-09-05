const { Sequelize } = require('sequelize');
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
