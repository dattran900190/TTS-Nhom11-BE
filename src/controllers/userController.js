import User from "../models/User.js";
import createError from "../utils/createError.js";


export const getUsers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate("role_id", "name")
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.json({
      message: "Danh sách người dùng",
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      users,
    });
  } catch (err) {
    next(err);
  }
};


export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, role_id } = req.body; // lấy dữ liệu 

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createUser(400, "Email đã tồn tại");
        }

        const newUser = new User({
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

        // Không cho phép cập nhật email
        // if (updateFields.email) {
        //     delete updateFields.email;
        // }

        // Nếu người dùng cố cập nhật email thì báo lỗi
        if (req.body.email) {
            throw createError(400, "Không được phép thay đổi email");
        }

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
        const { id } = req.params;

        const deletedUser = await User.findOneAndDelete({ id });
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
