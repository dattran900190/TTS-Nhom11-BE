import express from "express";
import {
  getDashboardSummary,
  getMonthlyRevenue,
  getTopProducts
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", getDashboardSummary);
router.get("/monthly-revenue", getMonthlyRevenue);
router.get("/top-products", getTopProducts);

export default router;
