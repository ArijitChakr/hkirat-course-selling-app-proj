require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const { MONGO_URL } = require("./config");
const { userRouter } = require("./routes/users");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

async function main() {
  await mongoose.connect(MONGO_URL);

  app.listen(3000);
}
main();
