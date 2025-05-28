// src/models/ProductVariant.js
import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock_quantity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
export default ProductVariant;
