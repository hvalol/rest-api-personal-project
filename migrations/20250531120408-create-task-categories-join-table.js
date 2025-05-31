"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TaskCategories", {
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, //Part of a composite primary key
        references: {
          model: "Tasks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, //Part of a composite primary key
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TaskCategories");
  },
};
