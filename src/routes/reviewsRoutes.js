import express from "express";
import {
  GetAllReviews,
  GetReviewById,
  ToggleReviewVisibility,
  AddUserReview
} from "../controllers/reviewController.js";

import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

// ADMIN ROUTES
router.get("/", adminAuth, GetAllReviews);             
router.get("/:id", adminAuth, GetReviewById);          
router.patch("/:id/toggle", adminAuth, ToggleReviewVisibility);

// USER ROUTE: Đăng nhập mới được đánh giá
router.post("/", authenticateToken, AddUserReview);

export default router;
