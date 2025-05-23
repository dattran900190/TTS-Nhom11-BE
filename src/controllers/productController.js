// src/controllers/productController.js
import Product from "../models/Product.js";
import createError from "../utils/createError.js";

export const getProducts = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate("brand_id", "name")
        .populate("category_id", "name")
        .sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    res.json({
      page: Number(page),
      total,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};


export const createProduct = async (req, res, next) => {
  try {
    const { name, description, brand_id, category_id, image_url, variants, price, total_stock } = req.body;

    const newProduct = new Product({
      name,
      description,
      brand_id,
      category_id,
      image_url,
      variants,
      price,
      total_stock
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: savedProduct
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,  // Sửa lại thành _id
      updateData,
      { new: true, runValidators: true }
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
		const { id } = req.params;

		const deleted = await Product.findOneAndDelete(id);

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

export const getProductDetail = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Tìm sản phẩm theo id
		const product = await Product.findOne(id)
			.populate("brand_id")       // Nếu bạn muốn hiển thị chi tiết thương hiệu
			.populate("category_id")   // Nếu bạn muốn hiển thị chi tiết danh mục
			.populate("variant_id");   // Nếu bạn muốn hiển thị chi tiết danh mục

		if (!product) {
			throw createError(404, "Không tìm thấy sản phẩm");
		}

		res.json({
			message: "Chi tiết sản phẩm",
			product
		});
	} catch (err) {
		next(err);
	}
};

// POST /products/:id/add-variant
export const addVariantToProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { volume, price, stock_quantity } = req.body;

    const product = await Product.findOne(id);
    if (!product) {
      throw createError(404, "Không tìm thấy sản phẩm");
    }

    product.variants.push({ volume, price, stock_quantity });
    await product.save();

    res.json({
      message: "Thêm biến thể thành công",
      product,
    });
  } catch (err) {
    next(err);
  }
};
