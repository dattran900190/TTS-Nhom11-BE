import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
  order_detail_id: { type: String, required: true, unique: true },
  order_id: { type: String, ref: "Order" },
  product_id: { type: String, ref: "Product" },
  quantity: Number,
  price_at_order_time: Number
}, { timestamps: { createdAt: true, updatedAt: false } });

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
export default OrderDetail;
