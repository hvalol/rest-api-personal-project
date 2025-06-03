"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // --- Fetch Users ---
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users" WHERE email IN ('testuser1@example.com', 'testuser2@example.com', 'testuser3@example.com', 'testuser4@example.com', 'testuser5@example.com');`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!users || users.length < 5) {
      console.log("Not all expected users found. Aborting task seeding.");
      return;
    }

    // Map emails to IDs for easier lookup
    const userMap = users.reduce((acc, user) => {
      acc[user.email] = user.id;
      return acc;
    }, {});

    // --- Insert Tasks ---
    const tasksData = [
      {
        title: "Finish Q2 Report (User 1)",
        userEmail: "testuser1@example.com",
        completed: false,
        dueDateOffset: { months: 1, days: 15 },
        categoryNames: ["Work", "Urgent"],
      },
      {
        title: "Book Flights for Vacation (User 1)",
        userEmail: "testuser1@example.com",
        completed: false,
        dueDateOffset: { days: 7 },
        categoryNames: ["Personal"],
      },
      {
        title: "Grocery Shopping (User 2)",
        userEmail: "testuser2@example.com",
        completed: true,
        categoryNames: ["Shopping"],
      },
      {
        title: "Plan Project Kickoff (User 2)",
        userEmail: "testuser2@example.com",
        completed: false,
        categoryNames: ["Projects", "Work"],
      },
      {
        title: "Client Meeting Prep (User 3)",
        userEmail: "testuser3@example.com",
        completed: false,
        categoryNames: ["Work", "Urgent"],
      },
      {
        title: "Gym Session (User 4)",
        userEmail: "testuser4@example.com",
        completed: true,
        categoryNames: ["Personal"],
      },
      {
        title: "Read New Book (User 5)",
        userEmail: "testuser5@example.com",
        completed: false,
        categoryNames: ["Personal", "Projects"],
      },
    ];

    const tasksToInsert = tasksData.map((task) => {
      let dueDate = null;
      if (task.dueDateOffset) {
        const d = new Date(now);
        if (task.dueDateOffset.months)
          d.setMonth(d.getMonth() + task.dueDateOffset.months);
        if (task.dueDateOffset.days)
          d.setDate(d.getDate() + task.dueDateOffset.days);
        if (task.dueDateOffset.date) d.setDate(task.dueDateOffset.date);
        dueDate = d;
      }
      return {
        title: task.title,
        description: task.description || `Description for ${task.title}`,
        completed: task.completed,
        dueDate: dueDate,
        userId: userMap[task.userEmail],
        createdAt: now,
        updatedAt: now,
      };
    });
    await queryInterface.bulkInsert("Tasks", tasksToInsert, {});

    // --- Fetch newly inserted Tasks and Categories to get their IDs for join table ---
    const insertedTasks = await queryInterface.sequelize.query(
      `SELECT id, title, "userId" FROM "Tasks" WHERE "createdAt" >= '${now
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}';`, // Filter by creation time to get only newly inserted tasks
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const allCategories = await queryInterface.sequelize.query(
      `SELECT id, name, "userId" FROM "Categories";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const taskCategoriesToInsert = [];
    insertedTasks.forEach((task) => {
      const taskDataOrigin = tasksData.find(
        (td) => td.title === task.title && userMap[td.userEmail] === task.userId
      );
      if (taskDataOrigin && taskDataOrigin.categoryNames) {
        taskDataOrigin.categoryNames.forEach((catName) => {
          const category = allCategories.find(
            (cat) => cat.name === catName && cat.userId === task.userId
          );
          if (category) {
            taskCategoriesToInsert.push({
              taskId: task.id,
              categoryId: category.id,
              createdAt: now,
              updatedAt: now,
            });
          }
        });
      }
    });

    if (taskCategoriesToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "TaskCategories",
        taskCategoriesToInsert,
        {}
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order of creation to respect foreign key constraints
    await queryInterface.bulkDelete("TaskCategories", null, {});
    await queryInterface.bulkDelete("Tasks", null, {});
    // Categories and Users are handled by their respective seeder's down method.
  },
};
