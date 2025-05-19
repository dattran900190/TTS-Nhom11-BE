import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  brand_id: { type: String, required: true, unique: true },
  name: String,
  origin: String,
  description: String
}, { timestamps: true });

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
