import ProductVariant from "../models/ProductVariant.js";
import createError from "../utils/createError.js";
import Product from "../models/Product.js";
import messages from "../constants/index.js";
import { updateCartPricesByProductOrVariant } from './cartController.js';
import { pickFields } from "../utils/pickFields.js";

// Danh sách biến thể
export const getVariants = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "products", // tên bảng liên kết (collection tên là "products")
          localField: "product_id", // khóa chính trong variants
          foreignField: "_id",      // khóa liên kết trong products
          as: "product"             // gộp thông tin product vào biến "product"
        }
      },
      { $unwind: "$product" }, // vì product là mảng, cần tách thành object đơn
    ];

    // Nếu có từ khóa tìm kiếm theo tên sản phẩm
    if (search) {
      pipeline.push({
        $match: {
          "product.name": { $regex: search, $options: "i" }
        }
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) }
    );

    const [data, totalCount] = await Promise.all([
      ProductVariant.aggregate(pipeline),
      ProductVariant.aggregate([
        ...pipeline.slice(0, -3), // bỏ sort, skip, limit để đếm đúng
        { $count: "count" }
      ])
    ]);

    const total = totalCount[0]?.count || 0;

    res.json({
      page: Number(page),
      total,
      data,
    });

  } catch (err) {
    next(err);
  }
};



// Thêm biến thể mới
export const createVariant = async (req, res, next) => {
  try {
    const data = pickFields(req.body, ["product_id", "volume", "price", "stock_quantity"])

    if (!product_id) {
      throw createError({ messages: messages.PRODUCT_VARIANT.NOT_FOUND_ID});
    }

    const variant = new ProductVariant(data);
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
// export const updateVariant = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updateFields = req.body;

//     const oldVariant = await ProductVariant.findById(id);
//     if (!oldVariant) {
//       throw createError({ message: messages.PRODUCT_VARIANT.NOT_FOUND });
//     }

//     const updated = await ProductVariant.findByIdAndUpdate(
//       id,
//       updateFields,
//       { new: true, runValidators: true }
//     );

//     // Nếu price thay đổi, cập nhật giá trong giỏ hàng
//     if (updateFields.price !== undefined && updateFields.price !== oldVariant.price) {
//       await updateCartPricesByProductOrVariant({ product_id: undefined, variant_id: id, newPrice: updateFields.price });
//     }

//     res.json({
//       message: messages.PRODUCT_VARIANT.UPDATE_SUCCESS,
//       variant: updated
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const updateVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lấy dữ liệu cũ trước khi cập nhật
    const oldVariant = await ProductVariant.findById(id);
    if (!oldVariant) {
      // throw createError({ message: messages.PRODUCT.NOT_FOUND });
      throw createError(404, messages.PRODUCT_VARIANT.NOT_FOUND);
    }

    const data = pickFields(req.body, ["product_id", "volume", "price", "stock_quantity"])
    const updated = await ProductVariant.findByIdAndUpdate(id, data, {new: true,});

    if (!updated) {
      // throw createError({ message: messages.PRODUCT.NOT_FOUND  });
      throw createError(404, messages.PRODUCT_VARIANT.NOT_FOUND);
    }

    // Nếu giá price thay đổi, cập nhật giá trong giỏ hàng
    if (data.price !== undefined && data.price !== oldVariant.price) {
      await updateCartPricesByProductOrVariant({
        product_id: undefined,
        variant_id: id,
        newPrice: data.price,
      });
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
export const addVariantToProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { volume, price, stock_quantity } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      throw createError({ message: messages.PRODUCT_VARIANT.NOT_FOUND });
    }

    const variants = await ProductVariant.find({ product_id: id });
    const variant = new ProductVariant({
      product_id: id,
      volume,
      price,
      stock_quantity
    });

    await variant.save();

    res.json({
      message: messages.PRODUCT_VARIANT.CREATE_SUCCESS,
      product,
    });

  } catch (err) {
    next(err);
  }
};


export const softDeleteVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await ProductVariant.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy biến thể." });
    }

    res.json({ message: "Đã xóa mềm biến thể.", data: updated });
  } catch (err) {
    next(err);
  }
};

export const restoreVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restored = await ProductVariant.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!restored) {
      return res.status(404).json({ message: "Không tìm thấy biến thể." });
    }

    res.json({ message: "Khôi phục biến thể thành công.", data: restored });
  } catch (err) {
    next(err);
  }
};
