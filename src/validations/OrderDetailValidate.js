// validations/orderDetail.validate.js
import { body, param, query } from "express-validator";


export const validateUpdateOrderDetail = [
  param("order_detail_id")
    .isMongoId().withMessage("order_detail_id không hợp lệ."),
  body("order_id")
    .optional()
    .isMongoId().withMessage("order_id không hợp lệ."),
  body("product_id")
    .optional()
    .isMongoId().withMessage("product_id không hợp lệ."),
  body("quantity")
    .optional()
    .isInt({ min: 1 }).withMessage("quantity phải là số nguyên >= 1."),
  body("price_at_order_time")
    .optional()
    .isFloat({ min: 0 }).withMessage("price_at_order_time phải là số >= 0."),
];


export const validateGetOrderDetails = [
  query("order_id")
    .optional()
    .isMongoId().withMessage("order_id không hợp lệ."),
  query("product_id")
    .optional()
    .isMongoId().withMessage("product_id không hợp lệ."),
];
