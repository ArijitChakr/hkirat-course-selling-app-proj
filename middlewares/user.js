const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");

function userAuth(req, res, next) {
  const authorization = req.cookies.authorization;

  try {
    const isVerified = jwt.verify(authorization, JWT_USER_SECRET);

    if (isVerified) {
      req.id = isVerified.id;
      next();
    } else {
      res.json({
        message: "You are not signed in",
      });
    }
  } catch (err) {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}

module.exports = {
  userAuth,
};
