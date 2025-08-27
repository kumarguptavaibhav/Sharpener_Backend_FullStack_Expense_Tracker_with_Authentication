const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbconnection");

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  premium_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Users;
