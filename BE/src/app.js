const express = require("express");

const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json());
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.send("heloword");
});
module.exports = app;
