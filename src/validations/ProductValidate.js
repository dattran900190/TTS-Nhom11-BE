// validations/product.validate.js
import { body, param, query } from "express-validator";

export const validateCreateProduct = [
  body("name").notEmpty().withMessage("Tên sản phẩm là bắt buộc."),
  body("description").optional().isString().withMessage("Mô tả phải là chuỗi."),
  body("brand_id").isMongoId().withMessage("brand_id không hợp lệ."),
  body("category_id").isMongoId().withMessage("category_id không hợp lệ."),
  body("image_url").optional().isString().withMessage("image_url phải là chuỗi."),
  body("variants").isArray({ min: 1 }).withMessage("Cần ít nhất một biến thể."),
  body("variants.*.volume").isNumeric().withMessage("Thể tích phải là số."),
  body("variants.*.price").isNumeric().withMessage("Giá phải là số."),
  body("variants.*.stock_quantity").optional().isInt({ min: 0 }).withMessage("Số lượng phải là số nguyên không âm."),
  body("price").optional().isNumeric().withMessage("Giá đại diện phải là số."),
  body("total_stock").optional().isInt({ min: 0 }).withMessage("Tổng số lượng phải là số nguyên không âm."),
];

export const validateUpdateProduct = [
  param("id").isMongoId().withMessage("ID sản phẩm không hợp lệ."),
  body("name").optional().notEmpty().withMessage("Tên sản phẩm không được để trống."),
  body("description").optional().isString().withMessage("Mô tả phải là chuỗi."),
  body("brand_id").optional().isMongoId().withMessage("brand_id không hợp lệ."),
  body("category_id").optional().isMongoId().withMessage("category_id không hợp lệ."),
  body("image_url").optional().isString().withMessage("image_url phải là chuỗi."),
  body("variants").optional().isArray().withMessage("variants phải là mảng."),
  body("variants.*.volume").optional().isNumeric().withMessage("Thể tích phải là số."),
  body("variants.*.price").optional().isNumeric().withMessage("Giá phải là số."),
  body("variants.*.stock_quantity").optional().isInt({ min: 0 }).withMessage("Số lượng phải là số nguyên không âm."),
  body("price").optional().isNumeric().withMessage("Giá đại diện phải là số."),
  body("total_stock").optional().isInt({ min: 0 }).withMessage("Tổng số lượng phải là số nguyên không âm."),
];

export const validateDeleteProduct = [
  param("id").isMongoId().withMessage("ID sản phẩm không hợp lệ."),
];

export const validateGetProduct = [
  query("search").optional().isString().withMessage("Từ khóa tìm kiếm phải là chuỗi."),
  query("page").optional().isInt({ min: 1 }).withMessage("Page phải là số nguyên >= 1."),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit phải là số nguyên >= 1."),
];
