const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connectmysql");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },

    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 500],
      },
    },

    verificationToken: {
      type: DataTypes.STRING,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    verifiedDate: {
      type: DataTypes.DATE,
    },

    passwordToken: {
      type: DataTypes.STRING,
    },

    passwordTokenExpiration: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: false }
);

module.exports = sequelize.models.User;
