import { query } from "express-validator";

// Validate thống kê doanh thu theo tháng
export const validateMonthlyRevenue = [
  query("year")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Năm không hợp lệ."),
];

// Validate lấy top sản phẩm bán chạy
export const validateTopProducts = [
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Số lượng giới hạn phải là số nguyên dương."),
];

// Validate đơn hàng theo danh mục
export const validateOrdersByCategory = [
  query("start_date")
    .optional()
    .isISO8601().withMessage("start_date phải là định dạng ngày hợp lệ."),
  query("end_date")
    .optional()
    .isISO8601().withMessage("end_date phải là định dạng ngày hợp lệ."),
];

// (Nếu cần) Validate tổng quan dashboard có phân quyền hoặc filter
export const validateDashboardSummary = [
  query("includeToday")
    .optional()
    .isBoolean().withMessage("includeToday phải là true hoặc false."),
];
