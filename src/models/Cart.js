import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  cart_id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User" },
  total_price: Number
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
