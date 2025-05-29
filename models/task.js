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
    }
  }
  Task.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
      dueDate: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
