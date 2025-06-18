import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateGetOrderStatusHistory,
  validateUpdateOrderStatusHistory,
} from "../validations/OrderStatusHistoryValidate.js";
import {
  getOrderStatusHistory,
  updateOrderStatusNote,
} from "../controllers/orderStatusHistoryController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", validateGetOrderStatusHistory, validateRequest, getOrderStatusHistory);
router.put("/:id", adminAuth, validateUpdateOrderStatusHistory, validateRequest, updateOrderStatusNote);

export default router;
