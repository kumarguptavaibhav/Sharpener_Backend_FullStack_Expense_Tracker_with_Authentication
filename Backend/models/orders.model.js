const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbconnection");

const Orders = sequelize.define("Orders", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  payment_session_id: {
    type: DataTypes.STRING, //it should be string
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR",
  },
  status: {
    type: DataTypes.ENUM("CREATED", "SUCCESS", "FAILED", "EXPIRED", "PENDING"),
    defaultValue: "CREATED",
  },
});

module.exports = Orders;
