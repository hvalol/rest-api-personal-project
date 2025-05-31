"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // A category belongs to one User
      Category.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // A category can be associated with many Tasks
      Category.belongsToMany(models.Task, {
        through: "TaskCategories", //The name of our join table
        foreignKey: "categoryId",
        otherKey: "taskId",
        as: "tasks",
      });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
