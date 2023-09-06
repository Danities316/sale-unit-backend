'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Businesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BusinessName: {
        type: Sequelize.STRING
      },
      BusinessCategory: {
        type: Sequelize.STRING
      },
      City: {
        type: Sequelize.STRING
      },
      YearFounded: {
        type: Sequelize.DATE
      },
      stateOfResidence: {
        type: Sequelize.STRING
      },
      BusinessDescription: {
        type: Sequelize.TEXT
      },
      BusinessLogo: {
        type: Sequelize.STRING
      },
      RegNo: {
        type: Sequelize.BOOLEAN
      },
      TenantID: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Businesses');
  }
};