import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  old_status: String,
  new_status: String,
  changed_by: String,
  changed_at: Date,
  note: String
});

const OrderStatusHistory = mongoose.model("OrderStatusHistory", historySchema);
export default OrderStatusHistory;
