const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectid = mongoose.Types.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: objectid,
});

const contentSchema = new Schema({
  videoUrl: String,
  imageUrl: String,
  docUrl: String,
  courseId: objectid,
});

const purchaseSchema = new Schema({
  courseId: objectid,
  userId: objectid,
});

const userModel = mongoose.model("users", userSchema);
const adminModel = mongoose.model("admins", adminSchema);
const courseModel = mongoose.model("courses", courseSchema);
const contentModel = mongoose.model("contents", contentSchema);
const purchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  contentModel,
  purchaseModel,
};
