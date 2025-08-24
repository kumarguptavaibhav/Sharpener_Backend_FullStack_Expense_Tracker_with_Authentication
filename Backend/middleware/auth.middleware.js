const jwt = require("jsonwebtoken");

const auth_middleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      let err = new Error("Authorization header missing");
      err.statusCode = 401;
      throw err;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      let err = new Error("Please Provide the token");
      err.statusCode = 401;
      throw err;
    }
    const user = jwt.verify(token, "Vaibhav");
    if (!user) {
      let err = new Error("Provide valid token");
      err.statusCode = 403;
      throw err;
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = auth_middleware;
