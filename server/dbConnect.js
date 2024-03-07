"use strict";
require("dotenv").config();

const { Sequelize } = require("sequelize");

// Creating a new Sequelize instance with database connection details from environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);
// Function to connect to MySQL database
const connectMysql = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Successful connection to MySQL Database
        ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("Unable to connect to MySQL database:", error);
    process.exit(1);
  }
};
connectMysql();

module.exports = {
  Sequelize: sequelize,
};
