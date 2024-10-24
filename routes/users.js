const { Router } = require("express");
const {
  userModel,
  courseModel,
  purchaseModel,
  contentModel,
} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/user");
const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  try {
    const hashedPass = await bcrypt.hash(password, 5);
    const response = await userModel.create({
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
      JWT_USER_SECRET
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

userRouter.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const response = await userModel.findOne({
      email,
    });
    const isCorrect = await bcrypt.compare(password, response.password);
    console.log(isCorrect);
    if (isCorrect) {
      const authorization = jwt.sign(
        {
          id: response._id,
        },
        JWT_USER_SECRET
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

userRouter.get("/my-course", userAuth, async function (req, res) {
  const userId = req.id;

  try {
    const purchased = await purchaseModel.find({
      userId,
    });
    const purchasedCourseIds = [];
    purchased.forEach((course) => {
      purchasedCourseIds.push(course.courseId);
    });

    const courses = await courseModel.find({
      _id: { $in: purchasedCourseIds },
    });

    res.json({
      courses,
    });
  } catch (err) {
    res.status(404).json({
      message: "No courses purchased yet",
    });
  }
});

userRouter.get("/course-content", userAuth, async function (req, res) {
  const { courseId } = req.body;

  try {
    const contents = await contentModel.find({
      courseId,
    });

    res.json({
      contents,
    });
  } catch (err) {
    res.status(403).json({
      message: "Something went wrong!",
    });
  }
});

module.exports = {
  userRouter,
};
