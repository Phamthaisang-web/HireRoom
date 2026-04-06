const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinConversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const chatService = require("./src/services/chat.service");
        const message = await chatService.sendMessage(data);

        io.to(`conversation_${data.conversationId}`).emit(
          "receiveMessage",
          message
        );
      } catch (err) {
        console.log("Socket error:", err.message);
      }
    });
  });
};