const app = require("./app");
const pool = require("./config/db");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;


const server = http.createServer(app);

// Gắn socket vào server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


module.exports.io = io;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công");
    connection.release();

    app.get("/", (req, res) => {
      res.json({
        message: "Server + Socket OK",
      });
    });


    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("joinConversation", (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`Join room conversation_${conversationId}`);
      });

      socket.on("sendMessage", async (data) => {
        try {
          const chatService = require("./services/chat.service");
          const message = await chatService.sendMessage(data);

          io.to(`conversation_${data.conversationId}`).emit("receiveMessage", message);
        } catch (err) {
          console.log("Socket error:", err.message);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // ❗ CHỈ DÙNG server.listen
    server.listen(PORT, () => {
      console.log(`Server chạy: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Lỗi MySQL:", error.message);
    process.exit(1);
  }
};

startServer();