import { Router } from "express";
import { register, login, sendOtp, resetPassword, confirmEmail, refreshToken,logout } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validations/AuthValidate.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";

const router = Router();

router.post("/register", registerValidator, validBodyRequest, register);
router.post("/login", loginValidator, validBodyRequest, login);
router.post("/send-otp", sendOtp);
router.get("/confirm-email", confirmEmail);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
export default router;
