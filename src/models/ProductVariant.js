// src/models/ProductVariant.js
import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
  variant_id: {
    type: String,
    required: true,
    unique: true
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
