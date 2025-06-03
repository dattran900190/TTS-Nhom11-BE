// src/controllers/productController.js
import Product from "../models/Product.js";
import createError from "../utils/createError.js";
import messages from "../constants/index.js";
import ProductVariant from "../models/ProductVariant.js";
import { updateCartPricesByProductOrVariant } from './cartController.js';
import { pickFields } from "../utils/pickFields.js";
export const getProducts = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 5, include_deleted, only_deleted } = req.query;

    const query = {
      name: { $regex: search, $options: "i" },
    };

    // Chỉ lấy product bị xoá mềm
    if (only_deleted === "true") {
      query.is_deleted = true;
    }
    // Nếu không include, mặc định là chưa xoá
    else if (include_deleted !== "true") {
      query.is_deleted = false;
    }

    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "productvariants",      // tên collection chứa các biến thể
          localField: "_id",            // trường trong bảng Product
          foreignField: "product_id",   // trường trong bảng ProductVariant dùng để liên kết
          as: "variants"                // tên trường mới sau khi join
        }
      }
    ]);

    res.json({
      page: Number(page),
      // total,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};


export const createProduct = async (req, res, next) => {
  try {
    const data = pickFields(req.body, ["name", "description", "brand_id", "category_id", "image_url", "price", "total_stock"]);

    const newProduct = new Product(data);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: messages.PRODUCT.CREATE_SUCCESS,
      data: savedProduct
    });
  } catch (err) {
    next(err);
  }
};


// export const updateProduct = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const oldProduct = await Product.findById(id);
//     if (!oldProduct) {
//       throw createError({ message: messages.PRODUCT.NOT_FOUND });
//     }

//     const updated = await Product.findByIdAndUpdate(
//       id, 
//       data, 
//       {new: true,}
//       );

//     if (!updated) {
//       throw createError({ message: messages.PRODUCT.NOT_FOUND });
//     }

//      // Nếu price thay đổi, cập nhật lại giá trong giỏ hàng
//     if (updateData.price !== undefined && updateData.price !== oldProduct.price) {
//       await updateCartPricesByProductOrVariant({ product_id: id, variant_id: undefined, newPrice: updateData.price });
//     }

//     res.json({
//       message: messages.PRODUCT.UPDATE_SUCCESS,
//       product: updated,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = pickFields(req.body, [ "name", "description", "price", "category_id", "brand_id", "image", "is_deleted" ]);

    const updated = await Product.findByIdAndUpdate(id, data, {new: true,});

    if (!updated) {
      throw createError({ message: messages.PRODUCT.NOT_FOUND });
    }

    const oldProduct = await Product.findById(id);
      if (!oldProduct) {
        throw createError({ message: messages.PRODUCT.NOT_FOUND });
      }

    // Nếu price thay đổi, cập nhật lại giá trong giỏ hàng
    if (updated.price !== undefined && updated.price !== oldProduct.price) {
      await updateCartPricesByProductOrVariant({ product_id: id, variant_id: undefined, newPrice: updated.price });
    }

    res.json({
      message: messages.PRODUCT.UPDATE_SUCCESS,
      product: updated,
    });
  } catch (err) {
    next(err);
  }
};


export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findOneAndDelete({ _id: id });

    if (!deleted) {
      throw createError({ message: messages.PRODUCT.NOT_FOUND });
    }

    // Xóa tất cả các variants liên quan
    await ProductVariant.deleteMany({ product_id: id });

    res.json({
      message: messages.PRODUCT.HARD_DELETE_SUCCESS,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm theo id
    const product = await Product.findById(id)
      .populate("brand_id")       // Nếu bạn muốn hiển thị chi tiết thương hiệu
      .populate("category_id")   // Nếu bạn muốn hiển thị chi tiết danh mục
    // .populate("variant_id");   // Nếu bạn muốn hiển thị chi tiết danh mục

    if (!product) {
      throw createError({ message: messages.PRODUCT.NOT_FOUND });
    }

    const variants = await ProductVariant.find({ product_id: id });
    res.json({
      message: messages.PRODUCT.GET_DETAIL_SUCCESS,
      product,
      variants
    });
  } catch (err) {
    next(err);
  }
};

export const softDeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!product) {
      throw createError({ message: messages.PRODUCT.NOT_FOUND });
    }

    res.json({
      message: messages.PRODUCT.SOFT_DELETE_SUCCESS,
      data: product
    });
  } catch (err) {
    next(err);
  }
};


export const restoreProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { is_deleted: false },
      { new: true }
    );

    if (!product) {
      throw createError({ message: messages.PRODUCT.NOT_FOUND });
    }

    res.json({
      message: messages.PRODUCT.RESTORE_SUCCESS,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

