const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tags = sequelize.define("tags", {
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  desc: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = Tags;
