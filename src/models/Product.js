import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  brand_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Brand",
  required: true
},
  category_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true
},
  image_url: {
    type: String
  },
  stock_quantity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // tự động tạo createdAt và updatedAt
});

const Product = mongoose.model("Product", productSchema);

export default Product;
