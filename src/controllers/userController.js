import User from "../models/User.js";
import createError from "../utils/createError.js";
import messages from "../constants/index.js";


export const getUsers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

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
      page: Number(page),
      total,
      data: users,
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
            throw createUser({ message: messages.USER.NOT_FOUND });
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
            message: messages.USER.CREATE_SUCCESS,
            user: savedUser
        });
    } catch (err) {
        next(err);
    }

};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        // Không cho phép cập nhật email
        // if (updateFields.email) {
        //     delete updateFields.email;
        // }

        // Nếu người dùng cố cập nhật email thì báo lỗi
        if (req.body.email) {
            throw createError({ message: messages.USER.NO_CHANGE_EMAIL });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateFields, {
            new: true, // trả về dữ liệu sau khi cập nhật
            runValidators: true, // áp dụng validate theo schema
        }
        );

        if (!updatedUser) {
            throw createUser({ message: messages.USER.NOT_FOUND });
        }

        res.json({
            message: messages.USER.UPDATE_SUCCESS,
            user: updatedUser
        })
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw createError({ message: messages.USER.NOT_FOUND });
        }

        res.json({
            message: messages.USER.HARD_DELETE_SUCCESS,
        })
    } catch (err) {
        next(err);
    }
};
