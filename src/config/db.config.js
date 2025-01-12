const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;

sequelize
  .sync({ force: false })
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.error("Error syncing database:", err));
