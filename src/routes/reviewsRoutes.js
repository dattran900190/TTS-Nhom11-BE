import express from "express";
import {
  GetAllReviews,
  GetReviewById,
  ToggleReviewVisibility
} from "../controllers/reviewController.js";

import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", adminAuth, GetAllReviews);             
router.get("/:id", adminAuth, GetReviewById);          
router.patch("/:id/toggle", adminAuth, ToggleReviewVisibility);

export default router;
