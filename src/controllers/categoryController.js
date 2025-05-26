import Category from "../models/Category.js";
import Product from "../models/Product.js";
import createError from "../utils/createError.js";
import { validationResult } from "express-validator";
import messages from "../constants/index.js";

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
    next(createError(400, messages.CATEGORY.CREATE_FAILED));
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
    if (!category) return next(createError(404, messages.CATEGORY.NOT_FOUND));
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
    if (!category) return next(createError(404, messages.CATEGORY.NOT_FOUND));

    if (isUncategorized(category))
      return next(createError(403, messages.CATEGORY.UPDATE_FORBIDDEN));

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
    if (!category) return next(createError(404, messages.CATEGORY.NOT_FOUND));

    if (isUncategorized(category))
      return next(createError(403, messages.CATEGORY.DELETE_FORBIDDEN));

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
      message: messages.CATEGORY.SOFT_DELETE_SUCCESS,
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

    if (!restored) return next(createError(404, messages.CATEGORY.NOT_FOUND));

    const uncategorizedCategory = await getUncategorizedCategory();

    await Product.updateMany(
      { category_id: uncategorizedCategory._id, old_category_id: restored._id },
      {
        category_id: restored._id,
        $unset: { old_category_id: "" },
      }
    );

    res.json({
      message: messages.CATEGORY.RESTORE_SUCCESS,
      data: restored,
    });
  } catch (err) {
    next(err);
  }
};

export const hardDeleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(createError(404, messages.CATEGORY.NOT_FOUND));

    if (isUncategorized(category))
      return next(createError(403, messages.CATEGORY.DELETE_FORBIDDEN));

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
      message: messages.CATEGORY.HARD_DELETE_SUCCESS,
    });
  } catch (err) {
    next(err);
  }
};
