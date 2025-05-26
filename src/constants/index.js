const messages = {
  AUTH: {
    EMAIL_EXISTS: "Email đã được sử dụng",
    INVALID_EMAIL: "Email không hợp lệ",
    INVALID_PASSWORD: "Mật khẩu không đúng",
    USER_NOT_FOUND: "Người dùng không tồn tại",
    EMAIL_NOT_CONFIRMED: "Vui lòng xác nhận email trước khi đăng nhập",
    LOGIN_SUCCESS: "Đăng nhập thành công",
    REGISTER_SUCCESS:
      "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.",
    EMAIL_CONFIRMED: "Email đã được xác nhận",
    EMAIL_ALREADY_CONFIRMED: "Email đã được xác nhận trước đó",
    CONFIRM_TOKEN_MISSING: "Thiếu token xác nhận",
    CONFIRM_TOKEN_INVALID: "Token xác nhận không hợp lệ hoặc đã hết hạn",
    ROLE_NOT_FOUND: "Vai trò không tồn tại",
    UNAUTHORIZED: "Chưa xác thực",
    FORBIDDEN: "Bạn không có quyền truy cập",
    OTP_SENT: "Mã OTP đã được gửi đến email",
    INVALID_OTP: "OTP không chính xác",
    OTP_EXPIRED: "OTP đã hết hạn",
    PASSWORD_UPDATED: "Mật khẩu đã được cập nhật",
    INVALID_REFRESH_TOKEN: "Refresh token không hợp lệ hoặc đã bị thu hồi",
    MISSING_INFORMATION: "Vui lòng nhập đầy đủ thông tin",
    MISSING_REFRESH_TOKEN: "Thiếu refresh token",
  },
  CATEGORY: {
    CREATE_FAILED: "Tạo danh mục thất bại",
    NOT_FOUND: "Không tìm thấy danh mục",
    UPDATE_FORBIDDEN: "Không được phép sửa danh mục 'Không phân loại'",
    DELETE_FORBIDDEN: "Không được phép xóa danh mục 'Không phân loại'",
    SOFT_DELETE_SUCCESS:
      "Xóa mềm thành công, sản phẩm được chuyển sang danh mục 'Không phân loại'",
    RESTORE_SUCCESS:
      "Khôi phục danh mục thành công, sản phẩm được trả về danh mục cũ",
    HARD_DELETE_SUCCESS: "Xóa cứng thành công",
  },
};

export default messages;
