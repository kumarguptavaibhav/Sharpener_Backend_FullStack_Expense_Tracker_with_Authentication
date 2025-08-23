const express = require("express");
const cors = require("cors");
const exprenseRoutes = require("./routes/exprense.routes");
const db = require("./utils/dbconnection");
const app = express();
const port = 3000;
require("./models/expenses.models");

app.use(cors());
app.use(express.json());

app.use("/expense", exprenseRoutes);

db.sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Error", error);
  });
