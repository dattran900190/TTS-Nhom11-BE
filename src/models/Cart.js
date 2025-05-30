import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  total_price: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
