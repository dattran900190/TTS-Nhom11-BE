import Category from "../models/Category.js";
import createError from "../utils/createError.js";

export const createCategory = async (req, res, next) => {
  try {
    const newCategory = new Category(req.body);
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    next(createError(400, "Tạo danh mục thất bại"));
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ deleted: false });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, deleted: false });
    if (!category) return next(createError(404, "Không tìm thấy danh mục"));
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true }
    );
    if (!updated) return next(createError(404, "Không tìm thấy danh mục"));
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { deleted: true },
      { new: true }
    );
    if (!deleted) return next(createError(404, "Không tìm thấy danh mục để xóa"));
    res.json({ message: "Xóa mềm thành công" });
  } catch (err) {
    next(err);
  }
};