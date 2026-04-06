const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const landlordRouter = require("./src/routes/landlord.route");
const authRouter = require("./src/routes/auth.route");
const roomRouter = require("./src/routes/room.route");

const chatRouter = require("./src/routes/chat.route");
const favoriteRouter = require("./src/routes/favorite.route");
const reviewRouter = require("./src/routes/review.route");
const replyRouter = require("./src/routes/reply.route");
const eventRouter = require("./src/routes/event.route");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 1. Cấu hình Storage để giữ lại đuôi file (jpg, png...)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });



// 2. Các Route API
app.use("/api/auth", authRouter);
app.use("/api/landlords", landlordRouter);
app.use("/api/rooms", roomRouter);

app.use("/api/chat", chatRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/replys", replyRouter);
app.use("/api/events", eventRouter);

// 3. SỬA LỖI 404: Thêm dấu / vào trước api/uploads
app.post("/api/uploads", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Không có file nào được chọn" });
  }

  // Trả về url dạng /uploads/tenfile.jpg để frontend dễ dùng
  const filePaths = req.files.map(
  (file) => `${req.protocol}://${req.get("host")}/api/uploads/${file.filename}`
);
  res.json({
    message: "Upload danh sách ảnh thành công",
    urls: filePaths,
  });
});


app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/", (req, res) => {
  res.send("heloword");
});

module.exports = app;