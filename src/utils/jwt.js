import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET, JWT_CONFIRM_EMAIL_SECRET } from "../configs/enviroments.js";

export const generateTokens = (user) => {
  const payload = {
    _id: user._id,
    role: user.role,
  };
  const refreshPayload = {
    _id: user._id, 
  };
  return {
    accessToken: jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" }),
    refreshToken: jwt.sign(refreshPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" }),
  };
};

export const generateConfirmEmailToken = (user) => {
  const payload = { _id: user._id, email: user.email };
  if (!JWT_CONFIRM_EMAIL_SECRET) throw new Error("JWT_CONFIRM_EMAIL_SECRET is not defined");
  return jwt.sign(payload, JWT_CONFIRM_EMAIL_SECRET, { expiresIn: "1d" });
};
