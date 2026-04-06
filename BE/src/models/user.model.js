const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: [true, "Họ tên là bắt buộc"] 
    },
    phone: { 
      type: String, 
      required: [true, "Số điện thoại là bắt buộc"], 
      unique: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, "Mật khẩu là bắt buộc"] 
    },
    role: { 
      type: String, 
      enum: ["user", "staff", "admin"], 
      default: "user" 
    },
  },
  { timestamps: true }
);

// Middleware mã hóa mật khẩu chuẩn Mongoose 6.x/7.x/8.x
userSchema.pre("save", async function () {
  // Nếu mật khẩu không thay đổi thì bỏ qua
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; 
  }
});

// Method so sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);