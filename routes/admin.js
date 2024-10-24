const { Router } = require("express");
const { adminAccessRouter } = require("./adminAccess");
const { adminAuth } = require("../middlewares/admin");
const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");
const adminRouter = Router();

adminRouter.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  try {
    const hashedPass = await bcrypt.hash(password, 5);
    const response = await adminModel.create({
      email,
      password: hashedPass,
      firstName,
      lastName,
    });

    const id = response._id;

    const authorization = jwt.sign(
      {
        id,
      },
      JWT_ADMIN_SECRET
    );

    res
      .cookie("authorization", authorization, {
        maxAge: 900000,
        httpOnly: true,
      })
      .json({
        message: "You are signed up",
      });
  } catch (error) {
    res.status(403).json({
      message: "Username or password already exists",
    });
  }
});

adminRouter.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const response = await adminModel.findOne({
      email,
    });
    const isCorrect = await bcrypt.compare(password, response.password);
    console.log(isCorrect);
    if (isCorrect) {
      const authorization = jwt.sign(
        {
          id: response._id,
        },
        JWT_ADMIN_SECRET
      );
      res
        .cookie("authorization", authorization, {
          maxAge: 900000,
          httpOnly: true,
        })
        .json({
          message: "You are signed in",
        });
    } else {
      res.status(403).json({
        message: "Invalid password",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Invalid Email/Password",
    });
  }
});

adminRouter.get("/all-courses", adminAuth, async function (req, res) {
  const creatorId = req.id;

  try {
    const courses = await courseModel.find({
      creatorId,
    });

    res.json({
      courses,
    });
  } catch (err) {
    res.status({
      message: "No match found",
    });
  }
});

adminRouter.use("/course", adminAuth, adminAccessRouter);

module.exports = {
  adminRouter,
};
