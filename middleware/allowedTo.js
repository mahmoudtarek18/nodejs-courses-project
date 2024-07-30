const { ERROR } = require("../utils/httpStatusText");
const appError = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = appError.create("this user is not authorized", 401, ERROR);
      return next(error);
    }
    next();
  };
};
