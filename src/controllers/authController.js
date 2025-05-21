import mongoose from "mongoose";
import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

const generateTokens = (user) => {
  const payload = {
    _id: user._id,
    role_id: user.role_id,
  };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

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
        return res.status(500).json({ success: false, message: "Role user chưa được thiết lập" });
      }
      assignedRoleId = userRole._id;
    } else {
      assignedRoleId = mongoose.Types.ObjectId(assignedRoleId);
    }

    const newUser = new User({
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

    const { accessToken, refreshToken } = generateTokens(newUser);

    await sendWelcomeEmail(email, name);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      accessToken,
      refreshToken,
      user: {
        _id: newUser._id,
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

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
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
