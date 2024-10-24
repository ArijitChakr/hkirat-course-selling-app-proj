const { Router } = require("express");
const { courseModel, contentModel } = require("../db");

const adminAccessRouter = Router();

adminAccessRouter.post("/create", async function (req, res) {
  const creatorId = req.id;
  const { title, description, price, imageUrl } = req.body;

  const response = await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    creatorId,
  });

  res.json({
    message: "You have successfully created this course",
    courseId: response._id,
  });
});

adminAccessRouter.put("/update", async function (req, res) {
  const creatorId = req.id;
  const { title, description, price, imageUrl, courseId } = req.body;

  try {
    const course = await courseModel.updateOne(
      {
        _id: courseId,
        creatorId,
      },
      {
        imageUrl,
        title,
        description,
        price,
      }
    );

    res.json({
      message: "Course successfully updated",
      courseId: course._id,
    });
  } catch (err) {
    res.status(400).json({
      message: "bad request",
    });
  }
});

adminAccessRouter.delete("/delete", async function (req, res) {
  const creatorId = req.id;
  const { courseId } = req.body;

  try {
    await courseModel.deleteOne({
      _id: courseId,
      creatorId,
    });

    res.json({
      message: "Course successfully deleted",
    });
  } catch (err) {
    res.status(403).json({
      message: "Something went wrong",
    });
  }
});

adminAccessRouter.get("/content", async function (req, res) {
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
      message: "No match Found",
    });
  }
});

adminAccessRouter.post("/create-content", async function (req, res) {
  const { videoUrl, imageUrl, docUrl, courseId } = req.body;

  try {
    const courseContent = await contentModel.create({
      videoUrl,
      imageUrl,
      docUrl,
      courseId,
    });

    res.json({
      message: "Course content uploaded",
      contentId: courseContent._id,
    });
  } catch (err) {
    res.status(403).json({
      message: "Something went wrong",
    });
  }
});

adminAccessRouter.put("/update-content", async function (req, res) {
  const { courseId, contentId, videoUrl, imageUrl, docUrl } = req.body;

  try {
    const updatedContent = await contentModel.updateOne(
      {
        _id: contentId,
        courseId,
      },
      {
        videoUrl,
        imageUrl,
        docUrl,
        courseId,
      }
    );

    res.json({
      message: "Course content updated successfully",
      contentId: updatedContent._id,
    });
  } catch (err) {
    res.status(403).json({
      message: "Something went wrong!",
    });
  }
});

adminAccessRouter.delete("/delete-content", async function (req, res) {
  const { courseId, contentId } = req.body;

  try {
    await contentModel.deleteOne({
      _id: contentId,
      courseId,
    });

    res.json({
      message: "Course content deleted successfully",
    });
  } catch (err) {
    res.status(403).json({
      message: "Something went worng",
    });
  }
});

module.exports = {
  adminAccessRouter,
};
