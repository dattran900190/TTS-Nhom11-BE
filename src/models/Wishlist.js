import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  wishlist_id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User" },
  product_id: { type: String, ref: "Product" }
}, { timestamps: { createdAt: true, updatedAt: false } });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
