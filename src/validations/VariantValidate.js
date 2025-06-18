// validations/variant.validate.js
import { body, param, query } from "express-validator";

// Validate tạo mới biến thể sản phẩm
export const validateCreateVariant = [
  // body("product_id")
  //   .notEmpty().withMessage("ID sản phẩm là bắt buộc.")
  //   .isMongoId().withMessage("ID sản phẩm không hợp lệ."),
  body("volume")
    .notEmpty().withMessage("Dung tích là bắt buộc.")
    .isNumeric().withMessage("Dung tích phải là số."),
  body("price")
    .notEmpty().withMessage("Giá là bắt buộc.")
    .isNumeric().withMessage("Giá phải là số."),
  body("stock_quantity")
    .optional()
    .isInt({ min: 0 }).withMessage("Số lượng tồn phải là số nguyên không âm."),
];

// Validate cập nhật biến thể sản phẩm
export const validateUpdateVariant = [
  // param("product_id").isMongoId().withMessage("ID không hợp lệ."),
  body("volume")
    .optional()
    .isNumeric().withMessage("Dung tích phải là số."),
  body("price")
    .optional()
    .isNumeric().withMessage("Giá phải là số."),
  body("stock_quantity")
    .optional()
    .isInt({ min: 0 }).withMessage("Số lượng tồn phải là số nguyên không âm."),
];

// Validate xoá biến thể
export const validateDeleteVariant = [
  param("id").isMongoId().withMessage("ID không hợp lệ."),
];

// Validate lấy danh sách biến thể (theo id hoặc tìm kiếm)
export const validateGetVariants = [
  query("id")
    .optional()
    .isMongoId().withMessage("ID sản phẩm không hợp lệ."),
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page phải là số nguyên >= 1."),
  query("limit")
    .optional()
    .isInt({ min: 1 }).withMessage("Limit phải là số nguyên >= 1."),
];


export const validateAddVariantVariant = [
  param("id")
    .isMongoId()
    .withMessage("ID không hợp lệ. ID phải là một Mongo ObjectId."),
];

export const validatesoftDeleteVariant = [
  param("id")
    .isMongoId()
    .withMessage("ID không hợp lệ. ID phải là một Mongo ObjectId."),
];

export const validateRestoreVariant = [
  param("id")
    .isMongoId()
    .withMessage("ID không hợp lệ. ID phải là một Mongo ObjectId."),
];