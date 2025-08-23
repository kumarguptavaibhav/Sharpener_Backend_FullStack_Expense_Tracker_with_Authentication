const express = require("express");
const cors = require("cors");
const exprenseRoutes = require("./routes/exprense.routes");
const usersRoutes = require("./routes/users.routes");
const db = require("./utils/dbconnection");
const app = express();
const port = 3000;
require("./models/association");

app.use(cors());
app.use(express.json());

app.use("/expense", exprenseRoutes);
app.use("/users", usersRoutes);

db.sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Error", error);
  });
