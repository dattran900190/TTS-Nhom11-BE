import { body, query, param } from "express-validator";

export const validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty().withMessage("Tên danh mục không được để trống")
    .isLength({ max: 50 }).withMessage("Tên danh mục tối đa 50 ký tự"),
];

export const validateUpdateCategory = [
  param("id")
    .isMongoId().withMessage("ID danh mục không hợp lệ"),
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Tên danh mục không được để trống nếu gửi lên")
    .isLength({ max: 50 }).withMessage("Tên danh mục tối đa 50 ký tự"),
];

export const validateGetCategories = [
  query("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100"),
  query("search").optional().trim().isString(),
];

export const validateDeleteCategory = [
  param("id")
    .isMongoId().withMessage("ID danh mục không hợp lệ"),
];

export const validateRestoreCategory = [
  param("id")
    .isMongoId().withMessage("ID danh mục không hợp lệ"),
];

export const validateHardDeleteCategory = [
  param("id")
    .isMongoId().withMessage("ID danh mục không hợp lệ"),
];

export const validateGetCategoryById = [
  param("id")
    .isMongoId().withMessage("ID danh mục không hợp lệ"),
];
