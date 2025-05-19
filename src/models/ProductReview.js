import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  review_id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User" },
  product_id: { type: String, ref: "Product" },
  rating: Number,
  comment: String
}, { timestamps: { createdAt: true, updatedAt: false } });

const ProductReview = mongoose.model("ProductReview", reviewSchema);
export default ProductReview;
