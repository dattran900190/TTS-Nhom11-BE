import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
