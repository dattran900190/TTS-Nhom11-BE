import ProductVariant from "../models/ProductVariant.js";
import createError from "../utils/createError.js";
import Product from "../models/Product.js";
import messages from "../constants/index.js";


// Danh sách biến thể
export const getVariants = async (req, res, next) => {
  try {
    const { product_id } = req.query;

    const query = product_id ? { product_id } : {};

    const data = await ProductVariant.find(query);
    res.json({
      data
    });
  } catch (err) {
    next(err);
  }
};

// Thêm biến thể mới
export const createVariant = async (req, res, next) => {
  try {
    const { product_id, volume, price, stock_quantity } = req.body;

    if (!product_id) {
      throw createError(404, 'Không tìm thấy ID sản phẩm');
    }

    const variant = new ProductVariant({ product_id, volume, price, stock_quantity });
    const saved = await variant.save();

    res.status(201).json({
      message: messages.PRODUCT_VARIANT.CREATE_SUCCESS,
      variant: saved
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật biến thể
export const updateVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updated = await ProductVariant.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw createError({ message: messages.PRODUCT_VARIANT.NOT_FOUND });
    }

    res.json({
      message: messages.PRODUCT_VARIANT.UPDATE_SUCCESS,
      variant: updated
    });
  } catch (err) {
    next(err);
  }
};

// Xoá biến thể
export const deleteVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await ProductVariant.findByIdAndDelete(id);

    if (!deleted) {
      throw createError({ message: messages.PRODUCT_VARIANT.NOT_FOUND });
    }

    res.json({
      message: messages.PRODUCT_VARIANT.HARD_DELETE_SUCCESS
    });
  } catch (err) {
    next(err);
  }
};

// Lấy tất cả biến thể theo sản phẩm
export const getVariantsByProduct = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const data = await ProductVariant.find({ product_id });

    res.json({ data });
  } catch (err) {
    next(err);
  }
};


// POST /products/:id/add-variant
// export const addVariantToProduct = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { volume, price, stock_quantity } = req.body;

//     const product = await Product.findById(id);
//     if (!product) {
//       throw createError({ message: messages.PRODUCT_VARIANT.NOT_FOUND });
//     }

//     product.variants.push({ volume, price, stock_quantity });
//     await product.save();

//     res.json({
//       message: messages.PRODUCT_VARIANT.CREATE_SUCCESS,
//       product,
//     });

//   } catch (err) {
//     next(err);
//   }
// };