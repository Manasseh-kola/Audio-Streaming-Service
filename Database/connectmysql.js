require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "reshuffle",
  "root",
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    port: process.env.MYSQL_PORT,
  }
);

module.exports = sequelize;
