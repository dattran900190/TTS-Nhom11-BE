import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: String,
  discount_percent: Number,
  start_date: Date,
  end_date: Date,
  usage_limit: Number,
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
