require("dotenv").config();

const http = require("http");
const app = require("./app");
const setupSocket = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// gắn socket
setupSocket(server);

// ❗ LUÔN chạy server trước
server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port http://localhost:" + PORT);
});