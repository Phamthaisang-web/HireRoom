const express = require("express");
const path = require("path");
const landlordRouter = require("./routes/landlord.route");
const authRouter = require("./routes/auth.route");
const roomRouter = require("./routes/room.route");
const imageRoomRouter = require("./routes/imageRoom.route");
const chatRouter = require("./routes/chat.route");
const favoriteRouter = require("./routes/favorite.route");
const reviewRouter = require("./routes/review.route");
const replyRouter = require("./routes/reply.route");
const eventRouter = require("./routes/event.route");

const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json());
app.use("/auth", authRouter);
app.use("/landlords", landlordRouter);
app.use("/rooms", roomRouter);
app.use("/image-rooms", imageRoomRouter);
app.use("/api/chat", chatRouter);
app.use("/favorites", favoriteRouter);
app.use("/reviews", reviewRouter);
app.use("/replys", replyRouter);
app.use("/events", eventRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/", (req, res) => {
  res.send("heloword");
});
module.exports = app;
