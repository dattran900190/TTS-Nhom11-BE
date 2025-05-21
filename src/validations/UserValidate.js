import { body, param, query } from "express-validator";

export const validateCreateUser = [
  body("name").notEmpty().withMessage("Tên người dùng là bắt buộc."),
  body("email")
    .notEmpty().withMessage("Email là bắt buộc.")
    .isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .notEmpty().withMessage("Mật khẩu là bắt buộc.")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự."),
  body("phone")
    .notEmpty().withMessage("Số điện thoại là bắt buộc.")
    .isString().withMessage("Số điện thoại phải là chuỗi."),
  body("address")
    .notEmpty().withMessage("Địa chỉ là bắt buộc."),
  body("role_id")
    .notEmpty().withMessage("Vai trò là bắt buộc.")
    .isMongoId().withMessage("ID vai trò không hợp lệ."),
];

export const validateUpdateUser = [
  param("id").isMongoId().withMessage("ID người dùng không hợp lệ."),
  body("name").optional().notEmpty().withMessage("Tên không được để trống."),
  body("password").optional().isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự."),
  body("phone").optional().isString().withMessage("Số điện thoại phải là chuỗi."),
  body("address").optional(),
  body("role_id").optional().isMongoId().withMessage("ID vai trò không hợp lệ."),
  body("email").not().exists().withMessage("Không được phép cập nhật email.")
];

export const validateDeleteUser = [
  param("id").isMongoId().withMessage("ID người dùng không hợp lệ."),
];

export const validateGetUser = [
  query("search").optional().isString().withMessage("Từ khóa phải là chuỗi."),
  query("page").optional().isInt({ min: 1 }).withMessage("Page phải là số nguyên >= 1."),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit phải là số nguyên >= 1."),
];
