const sequelize = require("../config/db.config");

const User = require("./User");
const Blog = require("./Post");
const Tags = require("./Tags");
const Comments = require("./Comments");

// Syncing the database
sequelize
  .sync({ force: true })
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.error("Error syncing database:", err));
