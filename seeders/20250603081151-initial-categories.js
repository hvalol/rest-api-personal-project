"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const categoriesToInsert = [];
    const categoryNames = [
      "Work",
      "Personal",
      "Urgent",
      "Shopping",
      "Projects",
    ];

    // Fetch the users we created in the previous seeder
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users" WHERE email IN ('testuser1@example.com', 'testuser2@example.com', 'testuser3@example.com', 'testuser4@example.com', 'testuser5@example.com');`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!users || users.length === 0) {
      console.log(
        "No users found to associate categories with. Make sure the user seeder ran successfully."
      );
      return;
    }

    users.forEach((user) => {
      categoryNames.forEach((name) => {
        categoriesToInsert.push({
          name: name,
          userId: user.id, // Use the actual ID of the fetched user
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    if (categoriesToInsert.length > 0) {
      await queryInterface.bulkInsert("Categories", categoriesToInsert, {});
    } else {
      console.log("No categories to insert.");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
