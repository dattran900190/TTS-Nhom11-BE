import User from "../models/User.js";
import createError from "../utils/createError.js";


export const getUsers = async (req, res, next) => {
    try {
        const Users = await User.find();
        res.json({
            message: "Danh sách người dùng",
            Users
        });
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { user_id, name, email, password, phone, address, role_id } = req.body; // lấy dữ liệu 

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createUser(400, "Email đã tồn tại");
        }

        const newUser = new User({
            user_id,
            name,
            email,
            password,
            phone,
            address,
            role_id,
        }); // tạo object mới theo schema

        const savedUser = await newUser.save(); // .save() để ghi vào mongodb

        // trả dữ liệu vừa tạo
        res.status(201).json({
            message: "Thêm người dùng thành công",
            user: savedUser
        });
    } catch (err) {
        next(err);
    }

};

export const updateUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const updateFields = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { user_id },
            updateFields, {
            new: true, // trả về dữ liệu sau khi cập nhật
            runValidators: true, // áp dụng validate theo schema
            }
        );

        if (!updatedUser) {
            throw createUser(400, "Không tìm thấy người dùng");
        }

        res.json({
            message: "Cập nhật người dùng thành công",
            user: updatedUser
        })
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        const deletedUser = await User.findOneAndDelete({ user_id });
        if (!deletedUser) {
            throw createError(400, "Không tìm thấy người dùng để xoá");
        }

        res.json({
            message: "Xoá người dùng thành công",
        })
    } catch (err) {
        res.status(500).json({ message: "Lỗi xoá người dùng", error: err.message });
    }
};
