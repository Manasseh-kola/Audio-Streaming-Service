const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connectmysql");
const User = require("./User");

const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: false }
);

module.exports = sequelize.models.Token;
