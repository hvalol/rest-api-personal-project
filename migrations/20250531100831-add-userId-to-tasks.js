"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Tasks", "userId");
  },
};
