import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateCreateOrder,
  validateUpdateOrder,
  validateDeleteOrder,
  validateGetOrders,
} from "../validations/OrderValidate.js";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";

const router = Router();

router.get(
  "/orders",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateGetOrders,
  validateRequest,
  getOrders
);
router.post(
  "/orders/create",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateCreateOrder,
  validateRequest,
  createOrder
);
router.put(
  "/orders/edit/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateUpdateOrder,
  validateRequest,
  updateOrder
);
router.delete(
  "/orders/delete/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateDeleteOrder,
  validateRequest,
  deleteOrder
);

export default router;
