import { body } from "express-validator";

export const registerValidator = [
  body("name").notEmpty().withMessage("Tên không được để trống"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").isLength({ min: 6 }).withMessage("Mật khẩu ít nhất 6 ký tự"),
  body("phone").optional().isMobilePhone().withMessage("Số điện thoại không hợp lệ"),
  body("address").optional().isLength({ max: 200 }).withMessage("Địa chỉ quá dài"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];
