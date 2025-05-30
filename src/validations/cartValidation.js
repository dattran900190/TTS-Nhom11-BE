import { body, param } from "express-validator";

export const validateCreateCart = [
  body("user_id")
    .exists().withMessage("Trường user_id là bắt buộc")
    .isString().withMessage("Trường user_id phải là chuỗi ký tự"),
];

// Sửa validateAddItemToCart: bỏ cart_id
export const validateAddItemToCart = [
  body("product_id")
    .exists().withMessage("Trường product_id là bắt buộc")
    .isString().withMessage("Trường product_id phải là chuỗi ký tự"),
  body("quantity")
    .exists().withMessage("Trường quantity là bắt buộc")
    .isInt({ min: 1 }).withMessage("Trường quantity phải là số nguyên lớn hơn hoặc bằng 1"),
  body("variant_id")
    .optional()
    .isString().withMessage("Trường variant_id phải là chuỗi ký tự nếu có"),
];

export const validateGetCartByUser = [
  param("userId")
    .exists().withMessage("Tham số userId là bắt buộc")
    .isString().withMessage("Tham số userId phải là chuỗi ký tự"),
];

export const validateUpdateCartItem = [
  param("id")
    .exists().withMessage("Tham số id của sản phẩm trong giỏ hàng là bắt buộc")
    .isString().withMessage("Tham số id phải là chuỗi ký tự"),
  body("quantity")
    .exists().withMessage("Trường quantity là bắt buộc")
    .isInt({ min: 1 }).withMessage("Trường quantity phải là số nguyên lớn hơn hoặc bằng 1"),
];

export const validateDeleteCartItem = [
  param("id")
    .exists().withMessage("Tham số id của sản phẩm trong giỏ hàng là bắt buộc")
    .isString().withMessage("Tham số id phải là chuỗi ký tự"),
];
