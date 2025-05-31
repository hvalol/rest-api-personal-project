"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "This email address is already in use." },
        validate: {
          isEmail: {
            msg: "Please enter a valid email address.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 100], //Min 8 chars
            msg: "Password must be at least 8 characters long.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        // this hook is executed before a new User record is created
        beforeCreate: async (user, options) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        // you could add a beforeUpdate hook here as well if you allow password changes
        beforeUpdate: async (user, options) => {
          // check if password changed
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );
  return User;
};
