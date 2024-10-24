const { Router } = require("express");
const { courseModel, purchaseModel } = require("../db");
const { userAuth } = require("../middlewares/user");
const courseRouter = Router();

courseRouter.post("/purchase", userAuth, async function (req, res) {
  const userId = req.id;
  const courseId = req.body.courseId;

  try {
    const response = await purchaseModel.create({
      userId,
      courseId,
    });

    res.json({
      message: "You have successfully purchased this course",
    });
  } catch (error) {
    res.status(404).json({
      message: "An error occured",
    });
  }
});

courseRouter.get("/all-courses", async function (req, res) {
  const response = await courseModel.find({});
  res.json({
    response,
  });
});

module.exports = {
  courseRouter,
};
