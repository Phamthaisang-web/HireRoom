const pool = require("./src/config/db");

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ DB OK");
    conn.release();
  } catch (err) {
    console.error("❌ DB lỗi:", err.message);
  }
})();