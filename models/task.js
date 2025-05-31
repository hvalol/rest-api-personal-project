"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // A Task should have a User
      Task.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // A task can have many Categories
      Task.belongsToMany(models.Category, {
        through: "TaskCategories", // the name of our join table
        foreignKey: "taskId",
        otherKey: "categoryId",
        as: "categories",
      });
    }
  }
  Task.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
      dueDate: { type: DataTypes.DATE, allowNull: true },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Task",
      paranoid: true,
      // The `deletedAt` column will be named 'deletedAt' by default.
      // You can customize it with `deletedAt: 'custom_name'` if you wish.
    }
  );
  return Task;
};
