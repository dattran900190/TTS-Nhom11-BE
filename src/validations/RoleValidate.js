// validations/role.validate.js
import { body, param, query } from "express-validator";

export const validateCreateRole = [
  body("name").notEmpty().withMessage("Tên vai trò là bắt buộc."),
  body("description").optional().isString().withMessage("Mô tả phải là chuỗi."),
];

export const validateUpdateRole = [
  param("id").isMongoId().withMessage("ID không hợp lệ."),
  body("name").notEmpty().withMessage("Tên vai trò là bắt buộc."),
  body("description").optional().isString().withMessage("Mô tả phải là chuỗi."),
];

export const validateDeleteRole = [
  param("id").isMongoId().withMessage("ID không hợp lệ."),
];

export const validateGetRole = [
  query("search").optional().isString().withMessage("Từ khóa phải là chuỗi."),
  query("page").optional().isInt({ min: 1 }).withMessage("Page phải là số nguyên >= 1."),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit phải là số nguyên >= 1."),
];
