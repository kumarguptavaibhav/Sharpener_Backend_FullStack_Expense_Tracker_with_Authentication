const premium_middleware = async (req, res, next) => {
  try {
    const user = req.user;
    const is_premium = user.is_premium;
    const curr_date = new Date();
    const premium_expiry_date = new Date(user.premium_expiry);
    if (!is_premium) {
      let err = new Error("You have no access, purchase premium");
      err.statusCode = 403;
      throw err;
    }
    if (is_premium && premium_expiry_date < curr_date) {
      let err = new Error("Your premium feature has been expired");
      err.statusCode = 403;
    }
    next();
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = premium_middleware;
