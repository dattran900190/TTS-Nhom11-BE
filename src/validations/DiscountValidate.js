// validations/Discount.validate.js
import { body, param, query } from "express-validator";

// Validate tạo mới Discount
export const validateCreateDiscount = [
  body("code")
    .notEmpty().withMessage("Mã giảm giá không được để trống.")
    .isString().withMessage("Mã giảm giá phải là chuỗi."),

  body("discount_percent")
    .notEmpty().withMessage("Phần trăm giảm giá không được để trống.")
    .isFloat({ min: 0, max: 100 }).withMessage("Phần trăm giảm giá phải từ 0 đến 100."),

  body("start_date")
    .notEmpty().withMessage("Ngày bắt đầu không được để trống.")
    .isISO8601().withMessage("Ngày bắt đầu không hợp lệ."),

  body("end_date")
    .notEmpty().withMessage("Ngày kết thúc không được để trống.")
    .isISO8601().withMessage("Ngày kết thúc không hợp lệ.")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.start_date)) {
        throw new Error("Ngày kết thúc phải sau ngày bắt đầu.");
      }
      return true;
    }),

  body("usage_limit")
    .notEmpty().withMessage("Giới hạn sử dụng không được để trống.")
    .isInt({ min: 1 }).withMessage("Giới hạn sử dụng phải là số nguyên lớn hơn 0."),
];

// Validate cập nhật Discount
export const validateUpdateDiscount = [
  param("id").isMongoId().withMessage("ID không hợp lệ."),

  body("code")
  .notEmpty().withMessage("Mã giảm giá không được để trống.")
  .isString().withMessage("Mã giảm giá phải là chuỗi."),

  body("discount_percent")
  .notEmpty().withMessage("Phần trăm giảm giá không được để trống.")
  .isFloat({ min: 0, max: 100 }).withMessage("Phần trăm giảm giá phải từ 0 đến 100."),

  body("start_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Ngày bắt đầu không hợp lệ."),

  body("end_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Ngày kết thúc không hợp lệ.")
    .custom((value, { req }) => {
      if (req.body.start_date && new Date(value) < new Date(req.body.start_date)) {
        throw new Error("Ngày kết thúc phải sau ngày bắt đầu.");
      }
      return true;
    }),

  body("usage_limit")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Giới hạn sử dụng phải là số nguyên lớn hơn 0."),
];

// Validate xóa discount (xoá mềm)
export const validatesoftDeleteDiscount = [
  param("id")
    .isMongoId()
    .withMessage("ID không hợp lệ. ID phải là một Mongo ObjectId."),
];

// Validate khôi phục discount
export const validateRestoreDiscount = [
  param("id")
    .isMongoId()
    .withMessage("ID không hợp lệ. ID phải là một Mongo ObjectId."),
];

// Validate lấy 1 discount cụ thể
export const validateGetDiscount = [
  query("search")
    .optional()
    .isString().withMessage("Từ khóa tìm kiếm phải là chuỗi."),
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page phải là số nguyên >= 1."),
  query("limit")
    .optional()
    .isInt({ min: 1 }).withMessage("Limit phải là số nguyên >= 1."),
  query("include_deleted")
    .optional()
    .isBoolean().withMessage("include_deleted phải là true hoặc false."),
  query("only_deleted")
    .optional()
    .isBoolean().withMessage("only_deleted phải là true hoặc false."),
];

// Validate xóa hoàn toàn (nếu có)
export const validateDeleteDiscount = [
  param("id")
    .isMongoId()
    .withMessage("ID không hợp lệ."),
];
