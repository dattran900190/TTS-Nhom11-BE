import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  validateUpdateOrder,
  validateGetOrders,
  validateCreateOrder
} from "../validations/OrderValidate.js";

import { getOrders, updateOrder, createOrder } from "../controllers/orderController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", adminAuth, validateGetOrders, validateRequest, getOrders);
router.post("/", adminAuth, validateCreateOrder, validateRequest, createOrder);
router.put("/:id",adminAuth,validateUpdateOrder,validateRequest,updateOrder);

export default router;
