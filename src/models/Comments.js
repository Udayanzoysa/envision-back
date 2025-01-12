const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Blog = require("./Post");
const User = require("./User");

const Comments = sequelize.define("comments", {
  content: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM("approved", "pending", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  },
});

Comments.belongsTo(User);
User.hasMany(Comments);

Comments.belongsTo(Blog);
Blog.hasMany(Comments);

module.exports = Comments;
