import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  order_id: { type: String, ref: "Order" },
  payment_method: String,
  payment_status: String,
  transaction_id: String,
  paid_at: Date
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
