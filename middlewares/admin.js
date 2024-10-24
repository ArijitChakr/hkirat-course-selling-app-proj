const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");

function adminAuth(req, res, next) {
  const authorization = req.cookies.authorization;

  try {
    const isVerified = jwt.verify(authorization, JWT_ADMIN_SECRET);

    if (isVerified) {
      req.id = isVerified.id;
      next();
    } else {
      res.json({
        message: "You are not signed in",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}

module.exports = {
  adminAuth,
};
