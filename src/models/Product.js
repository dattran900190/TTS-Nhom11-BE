// models/Product.js
import mongoose from "mongoose";

// const variantSchema = new mongoose.Schema({
//   volume: {
//     type: Number,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   stock_quantity: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
// }, { _id: false }); // Không cần _id cho mỗi variant nếu không dùng đến

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   brand_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Brand",
//     required: true,
//   },
//   category_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true,
//   },
//   old_category_id: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Category", 
//     default: null },
//   image_url: String,
//   variants: [variantSchema], // nhiều biến thể

//   price: {
//     type: Number,
//     default: 0,
//   },
//   total_stock: {
//     type: Number,
//     default: 0,
//   },
//   is_deleted: {
//     type: Boolean,
//     default: false, // Mặc định là chưa bị xoá mềm
//   }

// }, {
//   timestamps: true,
// });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  old_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },
  image_url: String,
  price: {
    type: Number,
    default: 0,
  },
  total_stock: {
    type: Number,
    default: 0,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
export default Product;
