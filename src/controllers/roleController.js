import Role from "../models/Role.js";
import createError from "../utils/createError.js";

// Lấy danh sách vai trò
export const getRole = async (req, res, next) => {
  try {
     // Lấy query params Lấy các tham số trên URL, ví dụ: ?search=admin&page=1&limit=10
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = {
      name: { $regex: search, $options: "i" } // tìm kiếm không phân biệt hoa thường
    };

    const skip = (page - 1) * limit;

     const [roles, total] = await Promise.all([
      Role.find(query).skip(skip).limit(Number(limit)),
      Role.countDocuments(query)
    ]);

    res.json({
      message: "Danh sách vai trò",
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalRoles: total,
      roles
    });
  } catch (err) {
    next(err);
  }
};

// Tạo vai trò mới
export const createRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const newRole = new Role({ name, description });
    const savedRole = await newRole.save();

    res.status(201).json({
      message: "Thêm vai trò thành công",
      role: savedRole
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật vai trò theo _id
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params; // sử dụng _id thay vì role_id
    const { name, description } = req.body;

    const updated = await Role.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updated) {
      throw createError(404, "Không tìm thấy vai trò để cập nhật.");
    }

    res.json({
      message: "Cập nhật vai trò thành công",
      role: updated
    });
  } catch (err) {
    next(err);
  }
};

// Xoá vai trò theo _id
export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Role.findByIdAndDelete(id);

    if (!deleted) {
      throw createError(404, "Không tìm thấy vai trò để xoá.");
    }

    res.json({
      message: "Xoá vai trò thành công"
    });
  } catch (err) {
    next(err);
  }
};
