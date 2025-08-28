const Users = require("./users.models");
const Expenses = require("./expenses.models");
const Orders = require("./orders.model");
const ForgotPasswordRequests = require("./forgotpasswordrequests.models");

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(Orders);
Orders.belongsTo(Users);

Users.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(Users);
