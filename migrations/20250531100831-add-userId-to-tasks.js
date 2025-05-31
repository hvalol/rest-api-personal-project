"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tasks", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false, //every task must have a user
      references: {
        model: "Users", //This is a reference to another model
        key: "id", //The column name of the referenced model
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", //If a user is deleted, their tasks are also deleted
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tasks", "userId");
  },
};
