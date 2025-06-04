// validations/OrderStatusHistory .validate.js
import { body, param, query } from "express-validator";

export const validateUpdateOrderStatusHistory  = [
  param("id").isMongoId().withMessage("ID không hợp lệ."),
];

export const validateGetOrderStatusHistory  = [
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
