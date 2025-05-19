import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  history_id: { type: String, required: true, unique: true },
  order_id: { type: String, ref: "Order" },
  old_status: String,
  new_status: String,
  changed_by: String,
  changed_at: Date,
  note: String
});

const OrderStatusHistory = mongoose.model("OrderStatusHistory", historySchema);
export default OrderStatusHistory;
