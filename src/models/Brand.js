import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: String,
  origin: String,
  description: String,
  is_deleted: { type: Boolean, default: false }  // Soft delete flag
}, { timestamps: true });

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
