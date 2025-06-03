"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash("Password123!", salt);
    const hashedPassword2 = await bcrypt.hash("AnotherPass456!", salt);
    // For simplicity, we'll reuse for users 3-5, but unique passwords are best practice.

    const now = new Date();
    const usersToInsert = [
      {
        email: "testuser1@example.com",
        password: hashedPassword1,
        createdAt: now,
        updatedAt: now,
      },
      {
        email: "testuser2@example.com",
        password: hashedPassword2,
        createdAt: now,
        updatedAt: now,
      },
      {
        email: "testuser3@example.com",
        password: hashedPassword1, // Reusing for example
        createdAt: now,
        updatedAt: now,
      },
      {
        email: "testuser4@example.com",
        password: hashedPassword2, // Reusing for example
        createdAt: now,
        updatedAt: now,
      },
      {
        email: "testuser5@example.com",
        password: hashedPassword1, // Reusing for example
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Users", usersToInsert, {});
  },

  async down(queryInterface, Sequelize) {
    // It's safer to delete in reverse order of creation or tables with foreign keys pointing to this table first.
    // However, if Tasks and Categories have onDelete: CASCADE for userId, this is okay.
    // For explicit control, you might delete TaskCategories, Tasks, Categories before Users.
    await queryInterface.bulkDelete("Users", null, {});
  },
};
