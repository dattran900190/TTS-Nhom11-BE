// validations/order.validate.js
import { body, param, query } from "express-validator";

export const validateCreateOrder = [
  body("user_id")
    .notEmpty().withMessage("user_id là bắt buộc.")
    .isMongoId().withMessage("user_id không hợp lệ."),
  body("order_date")
    .optional()
    .isISO8601().toDate().withMessage("order_date phải là ngày hợp lệ."),
  body("status")
    .optional()
    .isString().withMessage("status phải là chuỗi.")
    .isIn(["pending","confirmed","shipping","delivered","cancelled"])
    .withMessage("status không hợp lệ."),
  body("shipping_address")
    .notEmpty().withMessage("shipping_address là bắt buộc.")
    .isString().withMessage("shipping_address phải là chuỗi."),
  body("note")
    .optional()
    .isString().withMessage("note phải là chuỗi."),
  body("total_price")
    .notEmpty().withMessage("total_price là bắt buộc.")
    .isFloat({ min: 0 }).withMessage("total_price phải là số >= 0."),
  body("discount_id")
    .optional()
    .isMongoId().withMessage("discount_id không hợp lệ."),
];

export const validateUpdateOrder = [
  param("id")
    .isMongoId().withMessage("id không hợp lệ."),
  body("user_id")
    .optional()
    .isMongoId().withMessage("user_id không hợp lệ."),
  body("order_date")
    .optional()
    .isISO8601().toDate().withMessage("order_date phải là ngày hợp lệ."),
  body("status")
    .optional()
    .isString().withMessage("status phải là chuỗi.")
    .isIn(["pending","confirmed","shipping","delivered","cancelled"])
    .withMessage("status không hợp lệ."),
  body("shipping_address")
    .optional()
    .isString().withMessage("shipping_address phải là chuỗi."),
  body("note")
    .optional()
    .isString().withMessage("note phải là chuỗi."),
  body("total_price")
    .optional()
    .isFloat({ min: 0 }).withMessage("total_price phải là số >= 0."),
  body("discount_id")
    .optional()
    .isMongoId().withMessage("discount_id không hợp lệ."),
];

export const validateDeleteOrder = [
  param("id")
    .isMongoId().withMessage("id không hợp lệ."),
];

export const validateGetOrders = [
  query("user_id")
    .optional()
    .isMongoId().withMessage("user_id không hợp lệ."),
  query("status")
    .optional()
    .isIn(["pending","confirmed","shipping","delivered","cancelled"])
    .withMessage("status không hợp lệ."),
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page phải là số nguyên >= 1."),
  query("limit")
    .optional()
    .isInt({ min: 1 }).withMessage("limit phải là số nguyên >= 1."),
];
