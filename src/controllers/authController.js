import mongoose from "mongoose";
import User from "../models/User.js";
import Role from "../models/Role.js";  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, role_id } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedRoleId = role_id;
    if (!assignedRoleId) {
      const userRole = await Role.findOne({ name: "User" });
      if (!userRole) {
        return res.status(500).json({ success: false, message: "Role user chưa được thiết lập trong hệ thống" });
      }
      assignedRoleId = userRole._id; 
    } else {
      assignedRoleId = mongoose.Types.ObjectId(assignedRoleId); 
    }

    const newUser = new User({
      user_id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role_id: assignedRoleId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role_id: newUser.role_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    next(error);
  }
};
