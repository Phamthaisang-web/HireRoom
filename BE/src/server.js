const app = require("./app");
const pool = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công");
    connection.release();

    app.get("/", (req, res) => {
      res.json({
        message: "Server chạy và kết nối MySQL thành công",
      });
    });

    app.listen(PORT, () => {
      console.log(`Server chạy thành công: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi kết nối MySQL:", error.message);
    process.exit(1);
  }
};

startServer();