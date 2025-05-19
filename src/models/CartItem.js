import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cart_item_id: { type: String, required: true, unique: true },
  cart_id: { type: String, ref: "Cart" },
  product_id: { type: String, ref: "Product" },
  quantity: Number,
  price: Number
}, { timestamps: true });

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
