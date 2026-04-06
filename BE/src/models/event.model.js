const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    // SỬA: Chuyển từ String sang Array để chứa nhiều ảnh
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
        isThumbnail: { type: Boolean, default: false }
      }
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["sắp diễn ra", "đang diễn ra", "đã kết thúc"], 
      default: "sắp diễn ra" 
    },
    // Thêm createdBy nếu chưa có để khớp với Controller
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);