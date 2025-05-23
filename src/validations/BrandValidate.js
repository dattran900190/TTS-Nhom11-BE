// validations/brand.validate.js
import { body, param, query } from "express-validator";

export const validateCreateBrand = [
  body("brand_id")
    .notEmpty().withMessage("brand_id là bắt buộc.")
    .isString().withMessage("brand_id phải là chuỗi."),
  body("name")
    .notEmpty().withMessage("Tên thương hiệu là bắt buộc.")
    .isString().withMessage("Tên thương hiệu phải là chuỗi."),
  body("origin")
    .optional()
    .isString().withMessage("Xuất xứ phải là chuỗi."),
  body("description")
    .optional()
    .isString().withMessage("Mô tả phải là chuỗi."),
];

export const validateUpdateBrand = [
  param("id").isMongoId().withMessage("ID không hợp lệ."),
  body("name")
    .optional()
    .notEmpty().withMessage("Tên thương hiệu không được để trống.")
    .isString().withMessage("Tên thương hiệu phải là chuỗi."),
  body("origin")
    .optional()
    .isString().withMessage("Xuất xứ phải là chuỗi."),
  body("description")
    .optional()
    .isString().withMessage("Mô tả phải là chuỗi."),
];

export const validateDeleteBrand = [
  param("id").isMongoId().withMessage("ID không hợp lệ."),
];

export const validateGetBrand = [
  query("search")
    .optional()
    .isString().withMessage("Từ khóa tìm kiếm phải là chuỗi."),
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page phải là số nguyên >= 1."),
  query("limit")
    .optional()
    .isInt({ min: 1 }).withMessage("Limit phải là số nguyên >= 1."),
];
