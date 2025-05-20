// src/controllers/productController.js
import Product from "../models/Product.js";
import createError from "../utils/createError.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();        // lấy tất cả
    res.status(201).json({
      mesage: "Danh sách sản phẩm",
      products: products
    })
  } catch (err) {
    next(err);                                    // đẩy vào errorHandler chung
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { product_id, name, description, price, brand_id, category_id, image_url, stock_quantity } = req.body;
    
    const existingProduct = await Product.findOne({ product_id })
    if (existingProduct) {
      throw createError(400, "Product ID đã tồn tại.");
    }

    const newProduct = new Product({
      product_id,
			name,
			description,
			price,
			brand_id,
			category_id,
			image_url,
			stock_quantity,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      mesage: "Thêm sản phẩm thành công",
      product: savedProduct
    })
  } catch (err) {
    next(err)
  }
}

export const updateProduct = async (req, res, next) => {
	try {
		const { product_id } = req.params;
		const updateData = req.body;

		const updated = await Product.findOneAndUpdate(
			{ product_id },
			updateData,
			{ new: true }
		);

		if (!updated) {
			throw createError(404, "Không tìm thấy sản phẩm để cập nhật.");
		}

		res.json({
			message: "Cập nhật sản phẩm thành công",
			product: updated,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteProduct = async (req, res, next) => {
	try {
		const { product_id } = req.params;

		const deleted = await Product.findOneAndDelete({ product_id });

		if (!deleted) {
			throw createError(404, "Không tìm thấy sản phẩm để xoá.");
		}

		res.json({
			message: "Xoá sản phẩm thành công",
		});
	} catch (err) {
		next(err);
	}
};