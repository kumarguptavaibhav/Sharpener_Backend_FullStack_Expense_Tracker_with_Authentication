const { DataTypes, UUID, UUIDV4 } = require("sequelize");
const sequelize = require("../utils/dbconnection");

const ForgotPasswordRequests = sequelize.define("ForgotPasswordRequests", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = ForgotPasswordRequests;
