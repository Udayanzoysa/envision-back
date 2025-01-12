const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define("user", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      // Dynamically return full name based on first_name and last_name
      const firstName = this.getDataValue("first_name");
      const lastName = this.getDataValue("last_name");
      return `${firstName} ${lastName}`;
    },
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      // Automatically generate slug from full name (first_name + last_name)
      const fullName = `${this.first_name} ${this.last_name}`;
      const formattedSlug = fullName.trim().replace(/\s+/g, "-").toLowerCase();
      this.setDataValue("slug", formattedSlug);
    },
    get() {
      // Return the slug value
      return this.getDataValue("slug");
    },
  },
  phone: { type: DataTypes.STRING, allowNull: false },
  imgix_url: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:
      "https://images.pexels.com/photos/30159434/pexels-photo-30159434/free-photo-of-intricate-floral-patterns-at-sheikh-zayed-mosque.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = User;
