import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
  order_id: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Order",
    required: true
  },
  product_id: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Product",
    required: true
  },
  quantity: Number,
  price_at_order_time: Number
}, { timestamps: { createdAt: true, updatedAt: false } });

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
export default OrderDetail;
