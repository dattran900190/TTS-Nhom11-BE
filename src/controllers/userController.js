import User from "../models/User.js";


export const getUsers = async (req, res) => {
    try {
        const Users = await User.find();
        res.json({
            message: "Danh sách người dùng",
            Users
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { user_id, name, email, password, phone, address, role_id } = req.body; // lấy dữ liệu 

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
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
        res.status(500).json({ message: err.message });
    }

};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
            new: true, // trả về dữ liệu sau khi cập nhật
            runValidators: true, // áp dụng validate theo schema
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        res.json({
            message: "Cập nhật người dùng thành công",
            user: updatedUser
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng để xoá" });
    }

    res.json({
            message: "Xoá người d thành công",
    })
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá người dùng", error: err.message });
  }
};
