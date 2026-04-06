const mongoose = require("mongoose");

const landlordSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ tên chủ trọ là bắt buộc"],
      maxlength: [100, "Họ tên không quá 100 ký tự"],
      minlength: [3, "Họ tên phải có ít nhất 3 ký tự"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      unique: true, // Đảm bảo không trùng số điện thoại
      trim: true,
    },
    zalo: { 
      type: String, 
      default: null,
      trim: true 
    },
    facebook: { 
      type: String, 
      default: null,
      trim: true 
    },
    note: { 
      type: String, 
      maxlength: [500, "Ghi chú không được quá 500 ký tự"],
      default: null 
    },
    status: {
      type: String,
      enum: ["đang hợp tác", "tạm nghỉ", "ngừng hợp tác"],
      default: "đang hợp tác",
    },
  },
  {
    // Tự động tạo createdAt và updatedAt (thay thế cho CURRENT_TIMESTAMP trong SQL)
    timestamps: true,
  }
);

// Tạo model từ Schema
module.exports = mongoose.model("Landlord", landlordSchema);