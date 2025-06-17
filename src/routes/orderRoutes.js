import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  validateUpdateOrder,
  validateGetOrders,
} from "../validations/OrderValidate.js";

import { getOrders, updateOrder } from "../controllers/orderController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", adminAuth, validateGetOrders, validateRequest, getOrders);
router.put(
  "/:id",
  adminAuth,
  validateUpdateOrder,
  validateRequest,
  updateOrder
);

export default router;
