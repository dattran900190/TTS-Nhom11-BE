import express from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateMonthlyRevenue,
  validateTopProducts,
  validateOrdersByCategory,
  validateDashboardSummary
} from "../validations/VariantValidate.js";

import {
  getDashboardSummary,
  getMonthlyRevenue,
  getTopProducts,
  getOrdersByCategory,
  getUserCount
} from "../controllers/dashboardController.js";

const router = express.Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/summary", adminAuth, validateDashboardSummary, getDashboardSummary);
router.get("/monthly-revenue", adminAuth, validateMonthlyRevenue, getMonthlyRevenue);
router.get("/top-products", adminAuth, validateTopProducts, getTopProducts);
router.get("/order-by-category", adminAuth, validateOrdersByCategory, getOrdersByCategory);
router.get("/user-count", adminAuth,  getUserCount);

export default router;
