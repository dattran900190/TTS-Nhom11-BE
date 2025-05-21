import ProductVariant from "../models/ProductVariant.js";
import createError from "../utils/createError.js";

// Danh sách biến thể
export const getVariants = async (req, res, next) => {
  try {
    const variants = await ProductVariant.find();
    res.json({ message: "Danh sách biến thể", variants });
  } catch (err) {
    next(err);
  }
};

// Thêm biến thể mới
export const createVariant = async (req, res, next) => {
  try {
    const { variant_id, volume, price, stock_quantity } = req.body;

    const existing = await ProductVariant.findOne({ variant_id });
    if (existing) {
      throw createError(400, "Biến thể đã tồn tại.");
    }

    const variant = new ProductVariant({ variant_id, volume, price, stock_quantity });
    const saved = await variant.save();

    res.status(201).json({ message: "Thêm biến thể thành công", variant: saved });
  } catch (err) {
    next(err);
  }
};

// Cập nhật
export const updateVariant = async (req, res, next) => {
  try {
    const { variant_id } = req.params;
    const updateFields = req.body;

    const updated = await ProductVariant.findOneAndUpdate(
      { variant_id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw createError(404, "Không tìm thấy biến thể để cập nhật.");
    }

    res.json({ message: "Cập nhật thành công", variant: updated });
  } catch (err) {
    next(err);
  }
};

// Xoá
export const deleteVariant = async (req, res, next) => {
  try {
    const { variant_id } = req.params;

    const deleted = await ProductVariant.findOneAndDelete({ variant_id });

    if (!deleted) {
      throw createError(404, "Không tìm thấy biến thể để xoá.");
    }

    res.json({ message: "Xoá biến thể thành công" });
  } catch (err) {
    next(err);
  }
};
