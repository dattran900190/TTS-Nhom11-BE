import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Types.ObjectId, ref: "Cart", required: true },
  product_id: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  variant_id: { type: mongoose.Types.ObjectId, ref: "ProductVariant", required: false }, // Thêm trường biến thể
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }, // Giá tại thời điểm thêm vào giỏ
  total_price: { type: Number, required: true, min: 0 }, // Tổng = quantity * price
}, { timestamps: true });

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
