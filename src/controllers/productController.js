// src/controllers/productController.js
import Product from "../models/Product.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();        // lấy tất cả
    res.status(200).json(products);
  } catch (err) {
    next(err);                                    // đẩy vào errorHandler chung
  }
};

