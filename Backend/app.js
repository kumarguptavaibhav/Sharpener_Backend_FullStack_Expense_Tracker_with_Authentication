const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const env = require("dotenv");
env.config();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const exprenseRoutes = require("./routes/exprense.routes");
const usersRoutes = require("./routes/users.routes");
const paymentRoutes = require("./routes/payments.routes");
const tokenRoutes = require("./routes/token.routes");
const premiumRoutes = require("./routes/premium.routes");
const passwordRoutes = require("./routes/password.routes");
const db = require("./utils/dbconnection");
const port = process.env.PORT;
require("./models/association");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(express.json());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/expense", exprenseRoutes);
app.use("/users", usersRoutes);
app.use("/payments", paymentRoutes);
app.use("/token", tokenRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);

db.sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Error", error);
  });
