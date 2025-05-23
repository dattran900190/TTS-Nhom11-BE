import Category from "../models/Category.js";
import Product from "../models/Product.js";
import createError from "../utils/createError.js";
import { validationResult } from "express-validator";

const getUncategorizedCategory = async () => {
  let category = await Category.findOne({ name: "Không phân loại" });
  if (!category) {
    category = new Category({
      name: "Không phân loại",
      description: "Danh mục mặc định cho sản phẩm chưa phân loại",
      deleted: false,
    });
    await category.save();
  }
  return category;
};

const isUncategorized = (category) => category.name === "Không phân loại";

export const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const newCategory = new Category(req.body);
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    next(createError(400, "Tạo danh mục thất bại"));
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const filter = {
      deleted: false,
      name: { $regex: search, $options: "i" },
    };

    const total = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!category) return next(createError(404, "Không tìm thấy danh mục"));
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!category) return next(createError(404, "Không tìm thấy danh mục"));

    if (isUncategorized(category))
      return next(
        createError(403, "Không được phép sửa danh mục 'Không phân loại'")
      );

    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const softDeleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!category)
      return next(createError(404, "Không tìm thấy danh mục để xóa"));

    if (isUncategorized(category))
      return next(
        createError(403, "Không được phép xóa danh mục 'Không phân loại'")
      );

    const uncategorizedCategory = await getUncategorizedCategory();

    await Product.updateMany(
      { category_id: category._id },
      {
        category_id: uncategorizedCategory._id,
        old_category_id: category._id,
      }
    );

    category.deleted = true;
    await category.save();

    res.json({
      message:
        "Xóa mềm thành công, sản phẩm được chuyển sang danh mục 'Không phân loại'",
    });
  } catch (err) {
    next(err);
  }
};

export const restoreCategory = async (req, res, next) => {
  try {
    const restored = await Category.findOneAndUpdate(
      { _id: req.params.id, deleted: true },
      { deleted: false },
      { new: true }
    );

    if (!restored)
      return next(createError(404, "Không tìm thấy danh mục để khôi phục"));

    const uncategorizedCategory = await getUncategorizedCategory();

    await Product.updateMany(
      { category_id: uncategorizedCategory._id, old_category_id: restored._id },
      {
        category_id: restored._id,
        $unset: { old_category_id: "" },
      }
    );

    res.json({
      message:
        "Khôi phục danh mục thành công, sản phẩm được trả về danh mục cũ",
      data: restored,
    });
  } catch (err) {
    next(err);
  }
};

export const hardDeleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return next(createError(404, "Không tìm thấy danh mục để xóa"));

    if (isUncategorized(category))
      return next(
        createError(403, "Không được phép xóa danh mục 'Không phân loại'")
      );

    const uncategorizedCategory = await getUncategorizedCategory();

    await Product.updateMany(
      { category_id: category._id },
      {
        category_id: uncategorizedCategory._id,
        $unset: { old_category_id: "" },
      }
    );

    await Category.deleteOne({ _id: category._id });

    res.json({
      message:
        "Xóa cứng thành công",
    });
  } catch (err) {
    next(err);
  }
};
