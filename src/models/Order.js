import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User" },
  order_date: Date,
  status: String,
  shipping_address: String,
  note: String,
  total_price: Number,
  discount_id: { type: String, ref: "Discount" }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
