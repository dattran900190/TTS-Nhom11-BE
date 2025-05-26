import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Chỉnh đúng đường dẫn nếu khác
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware xác thực token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });

    req.user = user; // Gắn thông tin user từ JWT vào request
    next();
  });
};

// Middleware kiểm tra quyền truy cập dựa trên vai trò
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực" });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
      }

      next();
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  };
};
