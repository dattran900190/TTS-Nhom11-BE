import { validationResult } from "express-validator";

export const validBodyRequest = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Dữ liệu gửi lên không hợp lệ",
        errors: errors.array(),
      });
    }
    next();
  } catch (error) {
    console.error("Validation middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi xử lý dữ liệu",
      error: error.message || error,
    });
  }
};
