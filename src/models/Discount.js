import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  discount_id: { type: String, required: true, unique: true },
  code: String,
  discount_percent: Number,
  start_date: Date,
  end_date: Date,
  usage_limit: Number
});

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
