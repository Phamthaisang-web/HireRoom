const express = require("express");

const landlordRouter = require("./routes/landlord.route");
const authRouter = require("./routes/auth.route");
const roomRouter = require("./routes/room.route");
const imageRoomRouter = require("./routes/imageRoom.route");

const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json());
app.use("/auth", authRouter);
app.use("/landlords", landlordRouter);
app.use("/rooms", roomRouter);
app.use("/image-rooms", imageRoomRouter);
app.get("/", (req, res) => {
  res.send("heloword");
});
module.exports = app;
