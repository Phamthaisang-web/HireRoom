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
  .connect("mongodb://localhost:27017/hireroom", mongooseDbOptions)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`server chay thasnh cong http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
  });
