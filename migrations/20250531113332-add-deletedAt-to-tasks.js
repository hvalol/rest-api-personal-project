"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tasks", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true, //it will be null for all non-deleted records
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tasks", "deletedAt");
  },
};
