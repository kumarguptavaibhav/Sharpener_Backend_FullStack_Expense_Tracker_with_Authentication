const express = require("express");
const cors = require("cors");
const path = require("path");
const exprenseRoutes = require("./routes/exprense.routes");
const usersRoutes = require("./routes/users.routes");
const paymentRoutes = require("./routes/payments.routes");
const tokenRoutes = require("./routes/token.routes");
const premiumRoutes = require("./routes/premium.routes");
const db = require("./utils/dbconnection");
const app = express();
const port = 3000;
require("./models/association");

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.use("/expense", exprenseRoutes);
app.use("/users", usersRoutes);
app.use("/payments", paymentRoutes);
app.use("/token", tokenRoutes);
app.use("/premium", premiumRoutes);

db.sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Error", error);
  });
