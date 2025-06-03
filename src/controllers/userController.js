import User from "../models/User.js";
import createError from "../utils/createError.js";
import messages from "../constants/index.js";
import { pickFields } from "../utils/pickFields.js";
import bcrypt from "bcrypt";

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
    const data = pickFields(req.body, ["name", "email", "password", "phone", "address", "role"]);
    const { email } = data;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError({ message: messages.USER.EMAIL_EXISTS }); // Sửa lại đúng error helper và message
    }

    // Băm password nếu có
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const newUser = new User(data);
    const savedUser = await newUser.save();

    res.status(201).json({
      message: messages.USER.CREATE_SUCCESS,
      data: savedUser
    });
  } catch (err) {
    next(err);
  }
};


// export const updateUser = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         // const updateFields = req.body;
//         const data = pickFields(req.body, [ "name", "email", "password", "phone", "address", "role_id" ]);


//         // Không cho phép cập nhật email
//         // if (updateFields.email) {
//         //     delete updateFields.email;
//         // }

//         // Nếu người dùng cố cập nhật email thì báo lỗi
//         if (req.body.email) {
//             throw createError({ message: messages.USER.NO_CHANGE_EMAIL });
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             id,
//             data, {
//             new: true, // trả về dữ liệu sau khi cập nhật
//             runValidators: true, // áp dụng validate theo schema
//         }
//         );

//         if (!updatedUser) {
//             throw createUser({ message: messages.USER.NOT_FOUND });
//         }

//         res.json({
//             message: messages.USER.UPDATE_SUCCESS,
//             data: updatedUser
//         })
//     } catch (err) {
//         next(err);
//     }
// }

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Không cho phép cập nhật email
    if (req.body.email) {
      throw createError(400, messages.USER.NO_CHANGE_EMAIL);
    }

    // Lấy các trường cần cập nhật
    const data = pickFields(req.body, ["name", "password", "phone", "address", "role"]);

    // Nếu có cập nhật password, hash lại
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      throw createError({ message: messages.USER.NOT_FOUND });
    }

    res.json({
      message: messages.USER.UPDATE_SUCCESS,
      data: updatedUser
    });

  } catch (err) {
    next(err);
  }
};

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
