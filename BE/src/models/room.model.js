const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Tiêu đề là bắt buộc"], 
      maxlength: [200, "Tiêu đề không quá 200 ký tự"],
      trim: true 
    },
    description: { type: String, default: "" },
    price: { type: Number, required: [true, "Giá phòng là bắt buộc"] },
    area: { type: Number, required: [true, "Diện tích là bắt buộc"] },
    address: { type: String, required: [true, "Địa chỉ là bắt buộc"] },
    city: String,
    district: String,
    ward: String,
    status: { type: String, default: "còn trống" },
    type: { type: String, default: "phòng trọ" },
    
    // --- CÁC TRƯỜNG DỊCH VỤ BỔ SUNG ---
    electricPrice: { type: Number, default: 0 },    // Tiền điện
    waterPrice: { type: Number, default: 0 },       // Tiền nước
    internetPrice: { type: Number, default: 0 },    // Tiền mạng
    maxPeople: { type: Number, default: 1 },        // Số người tối đa
    furniture: { type: String, default: "" },       // Đồ nội thất (ví dụ: giường, tủ, máy lạnh)
    // ---------------------------------

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { 
        type: [Number], 
        default: [0, 0] // [Longitude, Latitude]
      },
    },

    landlordId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Landlord", 
      required: [true, "ID chủ trọ là bắt buộc"] 
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, 
        isThumbnail: { type: Boolean, default: false }
      }
    ]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

roomSchema.index({ location: "2dsphere" });
roomSchema.index({ title: "text", address: "text", description: "text" });

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;