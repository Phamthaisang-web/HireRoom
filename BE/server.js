const app = require("./app");
const mongoose = require("mongoose");
const mongooseDbOptions = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};
const PORT = 8080;
mongoose
  .connect("mongodb+srv://nguyenvietanh:X3JS3pFAA9cSRV2L@hireroom.sng7rpd.mongodb.net/?appName=hireroom", mongooseDbOptions)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`server chay thasnh cong http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
  });
