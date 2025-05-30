import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import { sendOtpEmail } from "../utils/sendMail.js";
import { sendConfirmEmail } from "../utils/sendConfirmEmail.js";
import messages from "../constants/index.js";
import { generateTokens, generateConfirmEmailToken } from "../utils/jwt.js";
import { generateOtp } from '../middlewares/optMiddleware.js';
import {JWT_SECRET,JWT_REFRESH_SECRET,JWT_CONFIRM_EMAIL_SECRET} from "../configs/enviroments.js";
import Cart from "../models/Cart.js";

export const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: messages.AUTH.EMAIL_EXISTS });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
      isEmailConfirmed: false,
    });

    // Tạo giỏ hàng cho user mới ngay sau khi tạo tài khoản
    const newCart = new Cart({ user_id: newUser._id, total_price: 0 });
    await newCart.save();

    const token = generateConfirmEmailToken(newUser);
    await sendConfirmEmail(email, req.body.name, token);

    res.status(201).json({
      success: true,
      message: messages.AUTH.REGISTER_SUCCESS,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const confirmEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ message: messages.AUTH.CONFIRM_TOKEN_MISSING });

    const decoded = jwt.verify(token, JWT_CONFIRM_EMAIL_SECRET);
    const user = await User.findById(decoded._id);
    if (!user)
      return res.status(404).json({ message: messages.AUTH.USER_NOT_FOUND });
    if (user.isEmailConfirmed)
      return res
        .status(400)
        .json({ message: messages.AUTH.EMAIL_ALREADY_CONFIRMED });

    user.isEmailConfirmed = true;
    await user.save();

    res.redirect("http://localhost:3000/login");
  } catch {
    res.status(400).json({ message: messages.AUTH.CONFIRM_TOKEN_INVALID });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: messages.AUTH.USER_NOT_FOUND });
    if (!user.isEmailConfirmed)
      return res
        .status(403)
        .json({ message: messages.AUTH.EMAIL_NOT_CONFIRMED });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: messages.AUTH.INVALID_PASSWORD });

    const tokens = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    user.refreshTokens.push({ token: tokens.refreshToken, expiresAt });
    await user.save();

    res.json({
      success: true,
      message: messages.AUTH.LOGIN_SUCCESS,
      ...tokens,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: messages.AUTH.INVALID_EMAIL });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: messages.AUTH.USER_NOT_FOUND });
    const otp = generateOtp(6); 
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 phút

    await PasswordReset.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    res.json({ message: messages.AUTH.OTP_SENT });
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res
        .status(400)
        .json({ message: messages.AUTH.MISSING_INFORMATION });

    const resetRecord = await PasswordReset.findOne({ email, otp });
    if (!resetRecord)
      return res.status(400).json({ message: messages.AUTH.INVALID_OTP });
    if (resetRecord.expiresAt < new Date())
      return res.status(400).json({ message: messages.AUTH.OTP_EXPIRED });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });
    await PasswordReset.deleteOne({ _id: resetRecord._id });

    res.json({ message: messages.AUTH.PASSWORD_UPDATED });
  } catch (error) {
    next(error);
  }
};

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: messages.AUTH.UNAUTHORIZED });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: messages.AUTH.CONFIRM_TOKEN_INVALID });
    req.user = decoded;
    next();
  });
};

export const authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: messages.AUTH.UNAUTHORIZED });
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: messages.AUTH.FORBIDDEN });
    next();
  };

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(401)
        .json({ message: messages.AUTH.MISSING_REFRESH_TOKEN });
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);
    if (!user)
      return res.status(404).json({ message: messages.AUTH.USER_NOT_FOUND });

    const tokenIndex = user.refreshTokens.findIndex(
      (rt) => rt.token === refreshToken
    );
    if (tokenIndex === -1)
      return res
        .status(403)
        .json({ message: messages.AUTH.INVALID_REFRESH_TOKEN });
    const tokens = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens[tokenIndex] = { token: tokens.refreshToken, expiresAt };
    await user.save();
    res.json({ success: true, ...tokens });
  } catch {
    res.status(403).json({ message: messages.AUTH.INVALID_REFRESH_TOKEN });
  }
};
