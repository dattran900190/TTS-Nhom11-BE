import Role from "../models/Role.js";
import createError from "../utils/createError.js";


export const getRole = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.json({
        message: "Danh sách vai trò",
        roles
    });
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { role_id, name, description } = req.body; // lấy dữ liệu 

    const existing = await Role.findOne({ role_id }); // check id nếu tồn tại thì trả về lỗi 400
    if (existing) {
      throw createError(400, "Role ID đã tồn tại.")
    }

    const newRole = new Role({ role_id, name, description }); // tạo object mới theo schema
    const savedRole = await newRole.save(); // .save() để ghi vào mongodb

    // trả dữ liệu vừa tạo
    res.status(201).json({
        message: "Thêm vai trò thành công",
        Role: savedRole
    });
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
    try {
        const { role_id } = req.params;
        const { name, description } = req.body;

        const updated = await Role.findOneAndUpdate(
            { role_id },
            { name, description },
            { new: true } // trả về bản mới sau khi cập nhật
        );

        if (!updated) {
            throw createError(400, "Không tìm thấy vai trò để cập nhật.");
        }

        res.json({
            message: "Cập nhật vai trò thành công",
            role: updated
        })
    } catch (err) {
        next(err);
    }
}

export const deleteRole = async (req, res, next) => {
    try {
        const { role_id } = req.params;

        const deteled = await Role.findOneAndDelete({ role_id });

        if (!deteled) {
            throw createError(400, "Không tìm thấy vai trò để xoá.");
        }

        res.json({
            message: "Xoá vai trò thành công",
        })
    } catch (err) {
        next(err);
    }
}

