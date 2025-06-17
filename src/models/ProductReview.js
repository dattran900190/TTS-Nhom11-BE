import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user_id: { type: String, ref: "User" },
  product_id: { type: String, ref: "Product" },
  rating: Number,
  comment: String,
  is_visible: { type: Boolean, default: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

const ProductReview = mongoose.model("ProductReview", reviewSchema);
export default ProductReview;
